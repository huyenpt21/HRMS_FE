import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { MENU_TYPE } from 'constants/enums/common';
import {
  MyLeaveBudgetListHeader,
  MyOTBudgetListHeader,
} from 'constants/header';
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
import { removeEmptyValueInObject, sortInforWithDir } from 'utils/common';
import ExtraHeaderLeaveBudget from '../components/extraHeader';
import MenuRequestType from '../components/menuRequestType';
// import dataMock from './dataMock.json';
import styles from './myLeaveBudget.module.less';

export default function MyLeaveBudget() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<LeaveBudgetModel[]>([]);
  // * default feilters
  const defaultFilter: LeaveBudgetListQuery = {
    requestTypeId: searchParams.get('requestTypeId')
      ? Number(searchParams.get('requestTypeId'))
      : 1,
    search: searchParams.get('search') ?? undefined,
    month: searchParams.get('month')
      ? Number(searchParams.get('month'))
      : undefined,
    year: searchParams.get('year')
      ? Number(searchParams.get('year'))
      : moment().get('year'),
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );
  // * get header
  const header: HeaderTableFields[] =
    Number(stateQuery?.requestTypeId) !== 7
      ? MyLeaveBudgetListHeader
      : MyOTBudgetListHeader;

  // * get data table from API
  const { data: dataTable, isLoading } = useLeaveBudgetList(stateQuery);
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      if (el.key === 'requestTypeName') {
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
        el.width = '40%';
      }
      if (el.key === 'used') {
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      return {
        ...el,
        render: (data: any) => {
          if (data !== undefined && data !== null) {
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
    if (dataTable && dataTable?.data) {
      const {
        data: { items },
      } = dataTable;
      setRecords(items);
    }
  }, [dataTable, stateQuery]);
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
        <div className={styles.header__title}>My Benefit Budget</div>
      </div>
      <div className={styles.menu}>
        <MenuRequestType
          menuType={MENU_TYPE.MINE}
          setStateQuery={setStateQuery}
        />
      </div>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={false}
        extra={
          <ExtraHeaderLeaveBudget
            stateQuery={stateQuery}
            setStateQuery={setStateQuery}
            menuType={MENU_TYPE.MINE}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: LeaveBudgetModel) => record.id}
        className={`cursor-pointer ${styles.table}`}
        loading={isLoading}
      />
    </>
  );
}
