import { notification, TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { MESSAGE_RES, paginationConfig } from 'constants/common';
import { ACTION_TYPE, MENU_OPTION_KEY } from 'constants/enums/common';
import { DepartmentHeader } from 'constants/header';
import { useDeleteDepartment, useDepartmentList } from 'hooks/useDepartment';
import { HeaderTableFields } from 'models/common';
import {
  DepartmentListQuery,
  DepartmentListSortFields,
  DepartmentModel,
  ResDepartmentModify,
} from 'models/department';
import { useState, useEffect, useRef } from 'react';
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
  const departmentId = useRef<number | undefined>();
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

  //  * get data header and content table
  const header: HeaderTableFields[] = DepartmentHeader;
  const { isLoading, isError, data: dataTable } = useDepartmentList(stateQuery);
  const { mutate: deleteDepartment } = useDeleteDepartment({
    onSuccess: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Delete department successfully' });
      }
    },
    onError: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'departmentName') {
        el.sorter = isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      return {
        ...el,
        render: (data: any, record: DepartmentModel) => {
          if (data) {
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
    });
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 80,
      align: 'center',
      render: (_, record: DepartmentModel) => {
        return (
          <MenuTableDepartment
            record={record}
            onClickMenu={menuActionHandler}
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

  const menuActionHandler = (
    itemSelected: DepartmentModel,
    actionType: MENU_OPTION_KEY,
  ) => {
    switch (actionType) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal(true);
        modalAction.current = ACTION_TYPE.EDIT;
        departmentId.current = itemSelected.id;
        break;
      }
      case MENU_OPTION_KEY.DELETE: {
        deleteDepartment({ uid: itemSelected.id, currentFilter: stateQuery });
        break;
      }
    }
  };

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
    departmentId.current = undefined;
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
              departmentId.current = record.id;
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
          departmentId={departmentId.current}
        />
      )}
    </>
  );
}
