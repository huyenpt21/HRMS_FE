import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { DeviceTypeHeader } from 'constants/header';
import { useDeviceTypeList } from 'hooks/useDeviceType';
import { HeaderTableFields } from 'models/common';
import {
  DeviceTypeListQuery,
  DeviceTypeListSortFields,
  DeviceTypeModel,
} from 'models/device';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEmptyPagination, removeEmptyValueInObject } from 'utils/common';
import ExtraHeaderDeviceType from '../components/extraHeader';

export default function DeviceTypeList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceTypeModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);

  // * defailt filters
  const defaultFilter: DeviceTypeListQuery = {
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
  const header: HeaderTableFields[] = DeviceTypeHeader;
  const { isLoading, isError, data: dataTable } = useDeviceTypeList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      return {
        ...el,
        render: (data: any, record: DeviceTypeModel) => {
          if (data) {
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    let sort = stateQuery.sort;
    let dir = stateQuery.dir;

    if (sorter.order) {
      const sortField = sorter.field as DeviceTypeListSortFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }
    // * set changing of pagination to state query
    setStateQuery((prev: DeviceTypeListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sort,
      dir,
    }));
  };

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={<ExtraHeaderDeviceType setStateQuery={setStateQuery} />}
        stateQuery={stateQuery}
        rowKey={(record: DeviceTypeModel) => record.id}
        loading={isLoading}
        isShowScroll
        className={'cursor-pointer'}
      />
    </>
  );
}
