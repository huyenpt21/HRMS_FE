import { PlusOutlined } from '@ant-design/icons';
import { Col, Row, TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { paginationConfig } from 'constants/common';
import { EmployeeListAllHeader as dataHeader } from 'constants/header';

import BasicTag from 'components/BasicTag';
import MenuOptions from 'components/MenuOpstions';
import {
  ACTION_TYPE,
  MENU_OPTION_KEY,
  STATUS_COLORS,
  VIEW_LIST_EMPLOYEE_TYPE,
} from 'constants/enums/common';
import { MENU_COMMON, POSITION_WORKING } from 'constants/fixData';
import {
  EmployeeListFields,
  EmployeeModel,
  EmployeeListQuery,
} from 'models/employee';
import { HeaderTableFields, MenuOptionsType } from 'models/common';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useEffect, useRef, useState } from 'react';
import { Params, useParams, useSearchParams } from 'react-router-dom';
import {
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import EmployeeDetailModal from '../EmployeeDetailModal';
import dataMock from './dataMock.json';
import styles from './employeeList.module.less';
export default function EmployeeList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<EmployeeModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const employeeId = useRef<number>();
  const paramUrl: Readonly<Params<string>> = useParams();
  const viewType = paramUrl.viewType || '';
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
  // const { isLoading, isError, data: dataTable, refetch } = useEmployeeList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'fullName' || el.key === 'rollNumber') {
        // el.sorter = isError;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      if (el.key === 'rollNumber' || el.key === 'status') {
        el.width = 100;
      } else if (el.key === 'department') {
        el.width = 100;
        // el.filterMultiple = isError;
        el.filterMultiple = true;
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
    if (viewType === VIEW_LIST_EMPLOYEE_TYPE.ALL) {
      columns.push({
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        width: 60,
        align: 'left',
        render: (_, record: EmployeeModel) => {
          let menuOptions: MenuOptionsType[] = MENU_COMMON;
          if (record?.isActive) {
            menuOptions = [
              ...menuOptions,
              {
                key: MENU_OPTION_KEY.DEACTIVE,
                label: 'Deactive',
              },
            ];
          } else {
            menuOptions = [
              ...menuOptions,
              {
                key: MENU_OPTION_KEY.ACTIVE,
                label: 'Active',
              },
              {
                key: MENU_OPTION_KEY.DELETE,
                label: 'Delete',
              },
            ];
          }
          return (
            <MenuOptions
              trigger={['click']}
              items={menuOptions}
              itemHandler={menuActionHandler}
              itemSelected={record}
            />
          );
        },
      });
    }
    setColumnsHeader(columns);
  }, [stateQuery, viewType]);
  // }, [stateQuery, isError]);

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
  }, [dataMock, stateQuery]);
  // }, [dataMock, stateQuery, isError]);

  const menuActionHandler = (
    menuItem: MenuInfo,
    itemSelected: EmployeeModel,
  ) => {
    switch (menuItem.key) {
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

  const addEmployeeHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
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

  const extraHeader = (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Employee List</div>
        {viewType === VIEW_LIST_EMPLOYEE_TYPE.ALL && (
          <BasicButton
            title="Add Employee"
            type="filled"
            icon={<PlusOutlined />}
            onClick={addEmployeeHandler}
          />
        )}
      </div>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          <Col span={4}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
            />
          </Col>
          <Col span={4}>
            <BasicSelect options={[]} placeholder="Department" />
          </Col>
          <Col span={4}>
            <BasicSelect
              options={POSITION_WORKING}
              placeholder="Position"
              allowClear
              showSearch
              optionFilterProp="children"
            />
          </Col>
        </Row>
      </div>
    </>
  );
  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={extraHeader}
        stateQuery={stateQuery}
        rowKey={(record: EmployeeModel) => record.id}
        // loading={isLoading}
        scroll={{ y: 240 }}
        onRow={(record: EmployeeModel) => {
          return rowClickHandler(record.id);
        }}
        className={styles.table}
      />
      {isShowDetailModal && (
        <EmployeeDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          action={modalAction.current}
          employeeId={employeeId.current}
          // refetchList={refetchList}
          viewType={viewType}
        />
      )}
    </>
  );
}
