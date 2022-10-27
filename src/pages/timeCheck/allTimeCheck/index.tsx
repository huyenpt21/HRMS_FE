import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { AllTimeCheckHeader } from 'constants/header';
import { HeaderTableFields } from 'models/common';
import {
  TimeCheckListQuery,
  TimeCheckListSortFields,
  TimeCheckModel,
} from 'models/timeCheck';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { removeEmptyValueInObject } from 'utils/common';
import ExtraTableTimeCheck from '../components/extraHeader';

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
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = AllTimeCheckHeader;
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      return {
        ...el,
      };
    });
    setColumnsHeader(columns);
  });
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
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: TimeCheckModel) => record.id}
      scroll={{ y: 240 }}
      className={'cursor-pointer'}
      // onRow={(record: TimeCheckModel) => {
      //   return rowClickHandler(record);
      // }}
      // loading={isLoading}
    />
  );
}
