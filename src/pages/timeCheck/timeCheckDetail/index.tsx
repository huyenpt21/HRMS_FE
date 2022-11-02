import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig, TIME_HOUR } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { MyTimeCheckHeader } from 'constants/header';
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
  sortInforWithDir,
} from 'utils/common';
import ExtraTableTimeCheck from '../components/extraHeader';
import dataMock from './dataMock.json';
import styles from './timeCheckDetail.module.less';

export default function TimeCheckDetail() {
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
    startDate: searchParams.get('startDate') ?? undefined,
    endDate: searchParams.get('endDate') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = MyTimeCheckHeader;
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      if (el.key === 'date') {
        el.width = 200;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
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
      if (el.key === 'requestTypeName') {
        el.width = 200;
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
  }, [header, stateQuery]);

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
      // setPagination((prevPagination: TablePaginationConfig) => ({
      //   ...prevPagination,
      //   current: pagination.page,
      //   pageSize: pagination.limit,
      //   total: pagination.totalRecords,
      // }));
    }
    // }
  }, []);

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

    setPagination((prevPagination: TablePaginationConfig) => ({
      ...prevPagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));

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
      extra={
        <ExtraTableTimeCheck
          menuType={MENU_TYPE.DETAIL}
          setStateQuery={setStateQuery}
          stateQuery={stateQuery}
        />
      }
      onChange={handleTableChange}
      pagination={pagination}
      stateQuery={stateQuery}
      rowKey={(record: TimeCheckModel) => record.id}
      scroll={{ y: 200 }}
    />
  );
}