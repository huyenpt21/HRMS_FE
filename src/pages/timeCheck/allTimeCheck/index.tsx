import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME, paginationConfig } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { AllTimeCheckHeader } from 'constants/header';
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
  getEndOfWeek,
  getStartOfWeek,
  removeEmptyValueInObject,
} from 'utils/common';
import ExtraTableTimeCheck from '../components/extraHeader';
import styles from './allTimeCheck.module.less';

export default function AllTimeCheck() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
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
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields, index: number) => {
      // * eanble sort in column & custom width
      if (el.key === 'rollNumber') {
        el.width = 150;
      }
      if (el.key === 'personName') {
        el.width = 230;
      }
      if (
        el.key !== 'rollNumber' &&
        el.key !== 'personName' &&
        el.key !== 'requestTypeName'
      ) {
        el.width = 130;
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
      };
    });
    setColumnsHeader(columns);
  }, [stateQuery]);

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
      data={[]}
      onChange={handleTableChange}
      pagination={1}
      extra={
        <ExtraTableTimeCheck
          menuType={MENU_TYPE.ALL}
          setStateQuery={setStateQuery}
          stateQuery={stateQuery}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: TimeCheckModel) => record.id}
      className={'cursor-pointer'}
      // onRow={(record: TimeCheckModel) => {
      //   return rowClickHandler(record);
      // }}
      // loading={isLoading}
    />
  );
}
