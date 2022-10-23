import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { EmployeeListAllHeader as dataHeader } from 'constants/header';

import BasicTag from 'components/BasicTag';
import {
  ACTION_TYPE,
  EMPLOYEE_MENU,
  MENU_OPTION_KEY,
  STATUS_COLORS,
} from 'constants/enums/common';
import { HeaderTableFields } from 'models/common';
import {
  EmployeeListFields,
  EmployeeListQuery,
  EmployeeModel,
} from 'models/employee';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import EmployeeDetailModal from '../components/detailModal';
import ExtraHeaderTable from '../components/extraHeader';
import MenuAction from '../components/menuAction';
import dataMock from '../dataMock.json';
import { useEmployeeList } from 'hooks/useEmployee';
export default function AllEmployeeList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<EmployeeModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const employeeId = useRef<number>();
  // * defailt filters
  const defaultFilter: EmployeeListQuery = {
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
  const header: HeaderTableFields[] = dataHeader;
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch,
  } = useEmployeeList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'fullName' || el.key === 'rollNumber') {
        el.sorter = isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      if (el.key === 'rollNumber' || el.key === 'status') {
        el.width = 100;
      } else if (el.key === 'department') {
        el.width = 100;
        el.filterMultiple = isError;
        el.filters = [
          { text: 'Dev', value: 'dev' },
          { text: 'Sale', value: 'sale' },
        ];
      } else {
        el.width = 200;
      }
      return {
        ...el,
        render: (data: any, record: EmployeeModel) => {
          if (el.key === 'status') {
            if (record.isActive)
              return (
                <BasicTag statusColor={STATUS_COLORS.SUCCESS} text="Active" />
              );
            else
              return (
                <BasicTag statusColor={STATUS_COLORS.DEFAULT} text="Inactive" />
              );
          }
          return <div>{data}</div>;
        },
      };
    });
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 60,
      align: 'left',
      render: (_, record: EmployeeModel) => {
        return <MenuAction record={record} onClickMenu={menuActionHandler} />;
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataMock && dataMock.data) {
      const {
        metadata: { pagination },
        data: { employeeList: recordsTable },
      } = dataMock;
      setRecords(recordsTable);
      if (!isEmptyPagination(pagination)) {
        // * set the pagination data from API
        // setPagination((prevPagination: TablePaginationConfig) => ({
        //   ...prevPagination,
        //   current: pagination.page,
        //   pageSize: pagination.limit,
        //   total: pagination.totalRecords,
        // }));
      }
    }
  }, [dataTable, stateQuery, isError]);

  const menuActionHandler = (
    itemSelected: EmployeeModel,
    actionType: MENU_OPTION_KEY,
  ) => {
    switch (actionType) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal(true);
        modalAction.current = ACTION_TYPE.EDIT;
        employeeId.current = itemSelected.id;
        break;
      }
      case MENU_OPTION_KEY.ACTIVE: {
        employeeId.current = itemSelected.id;
        break;
      }
      case MENU_OPTION_KEY.DEACTIVE: {
        employeeId.current = itemSelected.id;
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
      const sortField = sorter.field as EmployeeListFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }

    // ! Delete this function after setup API
    setPagination((prevPagination: TablePaginationConfig) => ({
      ...prevPagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

    // * set changing of pagination to state query
    setStateQuery((prev: EmployeeListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sort,
      dir,
    }));

    // * set filter to state query
    const filterKey: any = Object.keys(filters)[0];
    const filterValues: any = Object.values(filters)[0];
    setStateQuery((prev: EmployeeListQuery) => ({
      ...prev,
      [filterKey]: filterValues,
    }));
  };

  const cancelModalHandler = () => {
    setIsShowDetailModal(false);
  };

  const rowClickHandler = (id: number) => {
    return {
      onClick: () => {
        employeeId.current = id;
        modalAction.current = ACTION_TYPE.VIEW_DETAIL;
        setIsShowDetailModal(true);
      },
    };
  };

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={
          <ExtraHeaderTable
            modalAction={modalAction}
            setIsShowDetailModal={setIsShowDetailModal}
            setStateQuery={setStateQuery}
            menuType={EMPLOYEE_MENU.ALL}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: EmployeeModel) => record.id}
        loading={isLoading}
        scroll={{ y: 240 }}
        onRow={(record: EmployeeModel) => {
          return rowClickHandler(record.id);
        }}
        className={'cursor-pointer'}
      />
      {isShowDetailModal && (
        <EmployeeDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          action={modalAction.current}
          employeeId={employeeId.current}
          refetchList={refetch}
          viewType={EMPLOYEE_MENU.ALL}
        />
      )}
    </>
  );
}
