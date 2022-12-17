import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { DEVICE_MENU, STATUS, STATUS_COLORS } from 'constants/enums/common';
import { MyBorrowDeviceHistoryListHeader } from 'constants/header';
import { DEVICE } from 'constants/services';
import { useDeviceList } from 'hooks/useDevice';
import { HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import ExtraHeaderDevice from 'pages/device/components/extraHeader';
import DeviceMenuTable from 'pages/device/components/menuTableDevice';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
} from 'utils/common';

export default function MyBorrowDeviceHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const header: HeaderTableFields[] = MyBorrowDeviceHistoryListHeader;
  const {
    isLoading,
    isError,
    data: dataTable,
  } = useDeviceList(
    stateQuery,
    `${DEVICE.model.borrowHistory}`,
    'my-borrow-device-history',
  );

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      switch (el.key) {
        case 'deviceName':
        case 'borrowDate':
        case 'returnDate': {
          el.width = 200;
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
        case 'status': {
          el.width = 150;
          el.align = 'center';
        }
      }
      return {
        ...el,
        render: (data: string | number, record: DeviceModel) => {
          if (data !== null && data !== undefined) {
            if (
              (el.key === 'borrowDate' || el.key === 'returnDate') &&
              typeof data === 'string'
            ) {
              return getDateFormat(data, DATE_TIME_US);
            }
            if (el.key === 'status') {
              if (data === STATUS.RETURNED)
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.SUCCESS}
                    text={STATUS.RETURNED}
                  />
                );
              else if (data === STATUS.USING)
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.WARING}
                    text={STATUS.USING}
                  />
                );
              else if (data === STATUS.DELETED) {
                return (
                  <BasicTag
                    statusColor={STATUS_COLORS.DEFAULT}
                    text={STATUS.DELETED}
                  />
                );
              }
            }
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
    });
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record: DeviceModel) => {
        if (record?.status === STATUS.USING) {
          return (
            <DeviceMenuTable
              menuType={DEVICE_MENU.MY_BORROW_DEVICE_HISTORY}
              record={record}
            />
          );
        }
        return <span>-</span>;
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);
  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataTable && dataTable?.data) {
      const {
        metadata: { pagination },
        data: { items: recordsTable },
      } = dataTable;
      setRecords(recordsTable);
      if (!isEmptyPagination(pagination)) {
        // * set the pagination data from API
        setPagination((prevPagination: TablePaginationConfig) => ({
          ...prevPagination,
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.totalRecords,
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
      const sortField = sorter.field;
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
  const rowClickHandler = (record: DeviceModel) => {
    return {
      onClick: () => {
        navigate({
          pathname: `/emp-self-service/device-history/detail/${record?.id}`,
        });
      },
    };
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
          menuType={DEVICE_MENU.MY_BORROW_DEVICE_HISTORY}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: DeviceModel) => record?.id}
      loading={isLoading}
      isShowScroll
      className={'cursor-pointer'}
      onRow={(record: DeviceModel) => {
        return rowClickHandler(record);
      }}
    />
  );
}
