import { Menu, TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { LeaveBudgetListHeader } from 'constants/header';
import { useLeaveBudgetList } from 'hooks/useLeaveBudget';
import { HeaderTableFields } from 'models/common';
import {
  LeaveBudgetListQuery,
  LeaveBudgetListSortFields,
  LeaveBudgetModel,
} from 'models/leaveBudget';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEmptyPagination, removeEmptyValueInObject } from 'utils/common';
import ExtraHeaderLeaveBudget from './components/extraHeader';
import dataMock from './dataMock.json';
import styles from './leaveBudget.module.less';
export default function LeaveBudgetList() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<LeaveBudgetModel[]>([]);
  // * default feilters
  const defaultFilter: LeaveBudgetListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    month: searchParams.get('month')
      ? Number(searchParams.get('month'))
      : moment().get('month') + 1,
    year: searchParams.get('year')
      ? Number(searchParams.get('year'))
      : moment().get('year'),
    requestTypeId: searchParams.get('requestTypeId') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = LeaveBudgetListHeader;
  // * get data table from API
  const { data: dataTable } = useLeaveBudgetList(stateQuery);
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      return {
        ...el,
        render: (data: any) => {
          if (data) {
            return data;
          } else {
            return '-';
          }
        },
      };
    });
    setColumnsHeader(columns);
  }, [stateQuery]);
  // * get data source from API and set to state that store records for table
  useEffect(() => {
    // if (dataTable && dataTable?.data) {
    const {
      metadata: { pagination },
      data: { items },
    } = dataMock;
    setRecords(items);
    if (!isEmptyPagination(pagination)) {
      // * set the pagination data from API
      setPagination((prevPagination: TablePaginationConfig) => ({
        ...prevPagination,
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.totalRecords,
      }));
    }
    // }
  }, [dataTable]);
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    let sort = stateQuery.sort;
    let dir = stateQuery.dir;

    if (sorter.order) {
      const sortField = sorter.field as LeaveBudgetListSortFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }

    // * set changing of pagination to state query
    setStateQuery((prev: LeaveBudgetListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sort,
      dir,
    }));
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Leave Budget</div>
      </div>
      <div className={styles.menu}>
        <Menu
          theme="light"
          mode="vertical"
          triggerSubMenuAction="click"
          items={[
            { label: 'Annual Leave', key: 'anual-leave' },
            { label: 'Annual Leave', key: 'anual-leave2' },
            { label: 'Annual Leave', key: 'anual-leave3' },
            { label: 'Annual Leave', key: 'anual-leave4' },
            { label: 'Annual Leave', key: 'anual-leave5' },
            { label: 'Annual Leave', key: 'anual-leave6' },
          ]}
        />
      </div>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={<ExtraHeaderLeaveBudget setStateQuery={setStateQuery} />}
        stateQuery={stateQuery}
        rowKey={(record: LeaveBudgetModel) => record.id}
        isShowScroll
        className={`cursor-pointer ${styles.table}`}
      />
    </>
  );
}
