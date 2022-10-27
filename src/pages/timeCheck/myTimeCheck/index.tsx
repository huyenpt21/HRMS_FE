import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig, TIME_HOUR } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { MyTimeCheckHeader } from 'constants/header';
import { useTimeCheckList } from 'hooks/useTimeCheck';
import { HeaderTableFields } from 'models/common';
import {
  TimeCheckListQuery,
  TimeCheckListSortFields,
  TimeCheckModel,
} from 'models/timeCheck';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
} from 'utils/common';
import ExtraTableTimeCheck from '../components/extraHeader';
import dataMock from './dataMock.json';
import styles from './myTimeCheck.module.less';

export default function MyTimeCheck() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<TimeCheckModel[]>([]);
  // * default feilters
  const defaultFilter: TimeCheckListQuery = {
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
  // * get data table from API
  const {
    isLoading,
    isError,
    data: dataTable,
    // refetch: refetchList,
  } = useTimeCheckList(stateQuery);
  // * get header
  let header: HeaderTableFields[] = MyTimeCheckHeader;
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      if (el.key === 'date') {
        el.width = 250;
      }
      if (
        el.key === 'timeIn' ||
        el.key === 'timeOut' ||
        el.key === 'inLate' ||
        el.key === 'outEarly' ||
        el.key === 'workingTime' ||
        el.key === 'ot'
      ) {
        el.width = 150;
        el.align = 'center';
      }
      return {
        ...el,
        render: (data: any, record: TimeCheckModel) => {
          if (data !== null) {
            if (el.key === 'date') {
              return <span>{getDateFormat(data, DATE_TIME_US)}</span>;
            }
            if (el.key === 'timeIn') {
              return (
                <span
                  className={
                    !!record?.inLate
                      ? styles['time--red']
                      : styles['time--green']
                  }
                >
                  {getDateFormat(data, TIME_HOUR)}
                </span>
              );
            }
            if (el.key === 'timeOut') {
              return (
                <span
                  className={
                    !!record?.outEarly
                      ? styles['time--red']
                      : styles['time--green']
                  }
                >
                  {getDateFormat(data, TIME_HOUR)}
                </span>
              );
            }
            return <span>{data}</span>;
          }
          return <span>-</span>;
        },
      };
    });
    setColumnsHeader(columns);
  }, [header, isError]);
  // * get data source from API and set to state that store records for table
  useEffect(() => {
    // if (dataTable && dataTable?.data) {
    const {
      metadata: { pagination },
      data: { timeCheckList },
    } = dataMock;
    setRecords(timeCheckList);
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
      const sortField = sorter.field as TimeCheckListSortFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }

    // * set changing of pagination to state query
    setStateQuery((prev: TimeCheckListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sort,
      dir,
    }));
  };
  return (
    <CommonTable
      columns={columnsHeader}
      data={records}
      onChange={handleTableChange}
      pagination={pagination}
      extra={
        <ExtraTableTimeCheck
          menuType={MENU_TYPE.MIME}
          setStateQuery={setStateQuery}
          stateQuery={stateQuery}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: TimeCheckModel) => record.id}
      scroll={{ y: 240 }}
      className={'cursor-pointer'}
      // onRow={(record: TimeCheckModel) => {
      //   return rowClickHandler(record);
      // }}
      loading={isLoading}
    />
  );
}
