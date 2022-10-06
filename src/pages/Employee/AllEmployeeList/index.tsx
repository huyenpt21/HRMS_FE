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

import {
  EmployeeListFields,
  EmployeeListItem,
  EmployeeListQuery,
} from 'models/allEmployee';
import { HeaderTableFields } from 'models/common';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import dataMock from './dataMock.json';
import styles from './index.module.less';

export default function AllEmployeeList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<EmployeeListItem[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);

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
  // const { isLoading, isError, data: dataTable } = useEmployeeList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'name' || el.key === 'code') {
        // el.sorter = isError;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      if (el.key === 'name') {
        el.width = 250;
      } else if (el.key === 'code') {
        el.width = 150;
      } else if (el.key === 'email') {
        el.width = 300;
      } else if (el.key === 'department') {
        el.width = 150;
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
        render: (data: any) => {
          return <div>{data}</div>;
        },
      };
    });
    setColumnsHeader(columns);
  }, [stateQuery]);
  // }, [stateQuery, isError]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataMock && dataMock.data) {
      let {
        metadata: { pagination },
        data: { items: recordsTable },
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

  const extraHeader = (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Employee List</div>
        <BasicButton
          title="Add Employee"
          type="filled"
          icon={<PlusOutlined />}
        />
      </div>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          <Col span={8}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
            />
          </Col>
          <Col span={8}>
            <BasicSelect options={[]} placeholder="Department" />
          </Col>
          <Col span={8}>
            <BasicSelect options={[]} placeholder="Position" />
          </Col>
        </Row>
      </div>
    </>
  );
  return (
    <CommonTable
      columns={columnsHeader}
      data={records}
      onChange={handleTableChange}
      pagination={pagination}
      extra={extraHeader}
      stateQuery={stateQuery}
      rowKey={(record: EmployeeListItem) => record.uid}
      // loading={isLoading}
      scroll={{ y: 240 }}
    />
  );
}
