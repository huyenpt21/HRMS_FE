import { notification, TablePaginationConfig } from 'antd';
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
import { useEmployeeList, useUpdateEmployee } from 'hooks/useEmployee';
import { HeaderTableFields } from 'models/common';
import {
  EmployeeListFields,
  EmployeeListQuery,
  EmployeeModel,
  ResEmployeeModify,
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
import MenuAction from '../components/menuTable';
import { EMPLOYEE_CHANGE_STATUS } from 'constants/services';
export default function AllEmployeeList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<EmployeeModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const employeeRollNumber = useRef<string | undefined>();
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
    search: searchParams.get('search') ?? undefined,
    departmentId: searchParams.get('departmentId')
      ? Number(searchParams.get('departmentId'))
      : undefined,
    positionId: searchParams.get('positionId')
      ? Number(searchParams.get('positionId'))
      : undefined,
    isActive: searchParams.get('isActive')
      ? Number(searchParams.get('isActive'))
      : undefined,
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
  const { mutate: updateEmployee } = useUpdateEmployee(
    {
      onSuccess: (response: ResEmployeeModify) => {
        const {
          metadata: { message },
        } = response;

        if (message === 'Success') {
          notification.success({
            message: 'Update status successfully',
          });
          refetch();
        }
      },
    },
    EMPLOYEE_CHANGE_STATUS.service,
  );

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'rollNumber') {
        el.width = 150;
        el.sorter = !isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      if (el.key === 'fullName') {
        el.width = 250;
      }
      if (el.key === 'status' || el.key === 'department') {
        el.width = 100;
      }
      return {
        ...el,
        render: (data: any, record: EmployeeModel) => {
          if (data !== null) {
            if (el.key === 'isActive') {
              if (data)
                return (
                  <BasicTag statusColor={STATUS_COLORS.SUCCESS} text="Active" />
                );
              else
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.DEFAULT}
                    text="Inactive"
                  />
                );
            }
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
      render: (_, record: EmployeeModel) => {
        return <MenuAction record={record} onClickMenu={menuActionHandler} />;
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
    itemSelected: EmployeeModel,
    actionType: MENU_OPTION_KEY,
  ) => {
    switch (actionType) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal(true);
        modalAction.current = ACTION_TYPE.EDIT;
        employeeRollNumber.current = itemSelected.rollNumber;
        break;
      }
      case MENU_OPTION_KEY.ACTIVE: {
        updateEmployee({
          uid: itemSelected.rollNumber,
          body: { id: itemSelected.id, isActive: 1 },
        });
        break;
      }
      case MENU_OPTION_KEY.DEACTIVE: {
        updateEmployee({
          uid: itemSelected.rollNumber,
          body: { id: itemSelected.id, isActive: 0 },
        });
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
    employeeRollNumber.current = undefined;
  };

  const rowClickHandler = (rollNumber?: string) => {
    return {
      onClick: () => {
        employeeRollNumber.current = rollNumber;
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
            stateQuery={stateQuery}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: EmployeeModel) => record.id}
        loading={isLoading}
        isShowScroll
        onRow={(record: EmployeeModel) => {
          return rowClickHandler(record.rollNumber);
        }}
        className={'cursor-pointer'}
      />
      {isShowDetailModal && (
        <EmployeeDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          action={modalAction.current}
          employeeRollNumber={employeeRollNumber.current}
          refetchList={refetch}
          viewType={EMPLOYEE_MENU.ALL}
        />
      )}
    </>
  );
}
