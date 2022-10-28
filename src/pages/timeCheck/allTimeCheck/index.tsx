import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME, paginationConfig, TIME_HOUR } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { AllTimeCheckHeader } from 'constants/header';
import { TIME_CHECK } from 'constants/services';
import { useTimeCheckList } from 'hooks/useTimeCheck';
import { HeaderTableFields } from 'models/common';
import {
  TimeCheckListQuery,
  TimeCheckListSortFields,
  TimeCheckModel,
} from 'models/timeCheck';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  getEndOfWeek,
  getStartOfWeek,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import ExtraTableTimeCheck from '../components/extraHeader';
import styles from './allTimeCheck.module.less';
import dataMock from './dataMock.json';

export default function AllTimeCheck() {
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
    startDate:
      searchParams.get('startDate') ??
      getStartOfWeek(moment(), DATE_TIME).toString(),
    endDate:
      searchParams.get('endDate') ??
      getEndOfWeek(moment(), DATE_TIME).toString(),
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = AllTimeCheckHeader;
  // * get data table from API
  const {
    isLoading,
    isError,
    data: dataTable,
    // refetch: refetchList,
  } = useTimeCheckList(
    stateQuery,
    `${TIME_CHECK.model.manager} ${TIME_CHECK.service}/${TIME_CHECK.model.allSubordinate}`,
  );
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields, index: number) => {
      // * eanble sort in column & custom width
      if (el.key === 'rollNumber') {
        el.sorter = isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
        el.width = 150;
      }
      if (el.key === 'personName') {
        el.sorter = isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
        el.width = 230;
      }
      if (
        el.key !== 'rollNumber' &&
        el.key !== 'personName' &&
        el.key !== 'requestTypeName'
      ) {
        el.width = 150;
        el.align = 'center';
      }

      return {
        ...el,
        title: () => {
          if (
            el.key !== 'rollNumber' &&
            el.key !== 'personName' &&
            el.key !== 'requestTypeName'
          ) {
            var days = [];
            for (let i = 0; i <= 6; i++) {
              days.push(
                moment(stateQuery.startDate).add(i, 'days').format('MM/DD'),
              );
            }
            return (
              <div>
                <div className={styles['header--title']}>{el.title}</div>
                <div className={styles['header--date']}>{days[index - 2]}</div>
              </div>
            );
          }
          return el.title;
        },
        render: (data: any) => {
          if (data) {
            if (typeof data === 'object') {
              return (
                <div className={styles['time-container']}>
                  {(data?.timeIn || data?.timeOut) && (
                    <>
                      {data?.timeIn ? (
                        <span
                          className={
                            !!data?.inLate
                              ? styles['time--red']
                              : styles['time--green']
                          }
                        >
                          {getDateFormat(data.timeIn, TIME_HOUR)}
                        </span>
                      ) : (
                        '-'
                      )}
                      {data?.timeOut ? (
                        <span
                          className={
                            !!data?.outEarly
                              ? styles['time--red']
                              : styles['time--green']
                          }
                        >
                          {getDateFormat(data.timeOut, TIME_HOUR)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </>
                  )}
                </div>
              );
            }
            return data;
          }
          return '-';
        },
      };
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);

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
          menuType={MENU_TYPE.ALL}
          setStateQuery={setStateQuery}
          stateQuery={stateQuery}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: TimeCheckModel) => record.id}
      className={`cursor-pointer ${styles.table}`}
      // onRow={(record: TimeCheckModel) => {
      //   return rowClickHandler(record);
      // }}
      loading={isLoading}
      isShowScroll
    />
  );
}
