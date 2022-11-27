import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { STATUS_COLORS } from 'constants/enums/common';
import { AllDeviceListHeader } from 'constants/header';
import { useDeviceList } from 'hooks/useDevice';
import { HeaderTableFields } from 'models/common';
import { DeviceListFilter, DeviceListQuery, DeviceModel } from 'models/device';
import ExtraHeaderDevice from 'pages/device/components/extraHeader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import dataMock from './dataMock.json';

export default function AllDiviceList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  console.log(isShowDetailModal);
  // * defailt filters
  const defaultFilter: DeviceListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    isUsed: searchParams.get('isUsed')
      ? Number(searchParams.get('isUsed'))
      : undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  //  * get data header and content table
  const header: HeaderTableFields[] = AllDeviceListHeader;
  const { isLoading, isError, data: dataTable } = useDeviceList(stateQuery);
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'deviceCode') {
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      }
      return {
        ...el,
        render: (data: any, record: DeviceModel) => {
          if (data !== null && data !== undefined) {
            if (el.key === 'isUsed') {
              if (data)
                return (
                  <BasicTag statusColor={STATUS_COLORS.WARING} text="Used" />
                );
              else
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.SUCCESS}
                    text="Available"
                  />
                );
            }
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
    // if (dataTable && dataTable.data) {
    const {
      metadata: { pagination },
      data: { items: recordsTable },
    } = dataMock;
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
    // }
  }, [dataTable, stateQuery, isError]);
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    let sort = stateQuery.sort;
    let dir = stateQuery.dir;

    if (sorter.order) {
      const sortField = sorter.field as DeviceListFilter;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }
    // * set changing of pagination to state query
    setStateQuery((prev: DeviceListQuery) => ({
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
        extra={
          <ExtraHeaderDevice
            setIsShowDetailModal={setIsShowDetailModal}
            setStateQuery={setStateQuery}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: DeviceModel) => record.id}
        loading={isLoading}
        isShowScroll
        // onRow={(record: DeviceModel) => {
        //   return rowClickHandler(record.id);
        // }}
        className={'cursor-pointer'}
      />
    </>
  );
}
