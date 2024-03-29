import { TablePaginationConfig, Tooltip } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import SvgIcon from 'components/SvgIcon';
import { paginationConfig } from 'constants/common';
import { ACTION_TYPE } from 'constants/enums/common';
import { DepartmentHeader } from 'constants/header';
import { useDepartmentList } from 'hooks/useDepartment';
import { HeaderTableFields } from 'models/common';
import {
  DepartmentListQuery,
  DepartmentListSortFields,
  DepartmentModel,
} from 'models/department';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import ExtraHeaderDepartment from '../components/extraHeader';
import MenuTableDepartment from '../components/menuTable';
import DepartmentDetailModal from '../detailModal';
// import dataMock from './dataMock.json';

export default function DepartmentList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DepartmentModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const departmentIdRef = useRef<number | undefined>();
  // * defailt filters
  const defaultFilter: DepartmentListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get data header and content table
  const header: HeaderTableFields[] = DepartmentHeader;
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch: refetchList,
  } = useDepartmentList(stateQuery);
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'totalEmployee') {
        el.sorter = !isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      return {
        ...el,
        render: (data: any, record: DepartmentModel) => {
          if (data !== null && data !== undefined) {
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
    });
    columns.push({
      title: (
        <div>
          <Tooltip
            title="Can not edit or delete departments is currently have employees"
            placement="topRight"
          >
            Action <SvgIcon icon="infor" size={18} />
          </Tooltip>
        </div>
      ),
      key: 'action',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record: DepartmentModel) => {
        return (
          <MenuTableDepartment
            record={record}
            departmentIdRef={departmentIdRef}
            modalAction={modalAction}
            setIsShowDetailModal={setIsShowDetailModal}
            stateQuery={stateQuery}
          />
        );
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataTable && dataTable.data) {
      const {
        metadata: { pagination },
        data: { items: recordsTable },
      } = dataTable;
      setRecords(recordsTable);
      if (!isEmptyPagination(pagination)) {
        // * set the pagination data from API
        setPagination((prevPagination: TablePaginationConfig) => ({
          ...prevPagination,
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalRecords,
        }));
      }
    }
  }, [dataTable, stateQuery, isError]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    let sort = stateQuery.sort;
    let dir = stateQuery.dir;

    if (sorter.order) {
      const sortField = sorter.field as DepartmentListSortFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }
    // * set changing of pagination to state query
    setStateQuery((prev: DepartmentListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sort,
      dir,
    }));
  };
  const cancelModalHandler = () => {
    setIsShowDetailModal(false);
    departmentIdRef.current = undefined;
    modalAction.current = ACTION_TYPE.CREATE;
  };

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={
          <ExtraHeaderDepartment
            modalAction={modalAction}
            setIsShowDetailModal={setIsShowDetailModal}
            setStateQuery={setStateQuery}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: DepartmentModel) => record.id}
        loading={isLoading}
        isShowScroll
        className={'cursor-pointer'}
        onRow={(record: DepartmentModel) => {
          return {
            onClick: () => {
              departmentIdRef.current = record?.id;
              modalAction.current = ACTION_TYPE.VIEW_DETAIL;
              setIsShowDetailModal(true);
            },
          };
        }}
      />
      {isShowDetailModal && (
        <DepartmentDetailModal
          action={modalAction.current}
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          departmentId={departmentIdRef.current}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
