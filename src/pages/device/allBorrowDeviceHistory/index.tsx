import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { DEVICE_MENU, STATUS_COLORS } from 'constants/enums/common';
import { AllBorrowDeviceHistoryListHeader } from 'constants/header';
import { DEVICE } from 'constants/services';
import { useDeviceList } from 'hooks/useDevice';
import { HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import ExtraHeaderDevice from '../components/extraHeader';

export default function AllBorrowDeviceHistory() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  // * defailt filters
  const defaultFilter: DeviceListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    search: searchParams.get('search') ?? undefined,
    deviceTypeId: searchParams.get('deviceTypeId')
      ? Number(searchParams.get('deviceTypeId'))
      : undefined,
    isReturned: searchParams.get('isReturned')
      ? Number(searchParams.get('isReturned'))
      : undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );
  //  * get data header and content table
  const header: HeaderTableFields[] = AllBorrowDeviceHistoryListHeader;
  const {
    isLoading,
    isError,
    data: dataTable,
  } = useDeviceList(
    stateQuery,
    `${DEVICE.model.itSupport}/${DEVICE.model.borrowHistory}`,
  );
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      switch (el.key) {
        case 'rollNumber': {
          el.width = 150;
          el.sorter = true;
          el.sortOrder = sortInforWithDir(el.key, stateQuery);
          break;
        }
        case 'fullName': {
          el.width = 250;
          break;
        }
        case 'deviceTypeName': {
          el.width = 180;
          break;
        }
        case 'deviceCode': {
          el.width = 230;
          break;
        }
        case 'deviceName': {
          el.width = 250;
          break;
        }
        case 'borrowDate': {
          el.width = 250;
          break;
        }
        case 'returnDate': {
          el.width = 250;
          break;
        }
        case 'isReturned': {
          el.width = 150;
          el.align = 'center';
        }
      }
      return {
        ...el,
        render: (data: any, record: DeviceModel) => {
          if (data !== null && data !== undefined) {
            if (el.key === 'borrowDate' || el.key === 'returnDate') {
              return getDateFormat(data, DATE_TIME_US);
            }
            if (el.key === 'isReturned') {
              if (data)
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.SUCCESS}
                    text="Returned"
                  />
                );
              else
                return (
                  <BasicTag statusColor={STATUS_COLORS.WARING} text="Using" />
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
    // * set changing of pagination to state query
    setStateQuery((prev: DeviceListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };
  return (
    <CommonTable
      columns={columnsHeader}
      data={records}
      onChange={handleTableChange}
      pagination={pagination}
      extra={
        <ExtraHeaderDevice
          setStateQuery={setStateQuery}
          menuType={DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: DeviceModel) => record.id}
      loading={isLoading}
      isShowScroll
      className={'cursor-pointer'}
    />
  );
}
