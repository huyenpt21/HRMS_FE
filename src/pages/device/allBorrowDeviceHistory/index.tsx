import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { DEVICE_MENU, MENU_TYPE, STATUS_COLORS } from 'constants/enums/common';
import { AllBorrowDeviceHistoryListHeader } from 'constants/header';
import { DEVICE } from 'constants/services';
import { useDeviceList } from 'hooks/useDevice';
import { HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import ExtraHeaderDevice from '../components/extraHeader';
interface IProps {
  menuType: MENU_TYPE;
}
export default function AllBorrowDeviceHistory({ menuType }: IProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  // * defailt filters
  const defaultFilter: DeviceListQuery = useMemo(
    () => ({
      page: searchParams.get('page')
        ? Number(searchParams.get('page'))
        : paginationConfig.current,
      limit: searchParams.get('limit')
        ? Number(searchParams.get('limit'))
        : paginationConfig.pageSize,
      search: searchParams.get('search') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
      dir: searchParams.get('dir') ?? undefined,
      deviceTypeId: searchParams.get('deviceTypeId')
        ? Number(searchParams.get('deviceTypeId'))
        : undefined,
      isReturned: searchParams.get('isReturned')
        ? Number(searchParams.get('isReturned'))
        : undefined,
    }),
    [menuType],
  );
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
    menuType === MENU_TYPE.ALL
      ? `${DEVICE.model.itSupport}/${DEVICE.model.borrowHistory}`
      : `${DEVICE.model.manager}/${DEVICE.model.borrowHistory}`,
    menuType === MENU_TYPE.ALL
      ? 'all-borrow-device-history'
      : 'sub-borrow-device-history',
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
        case 'fullName':
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
        case 'isReturned': {
          el.width = 150;
          el.align = 'center';
        }
      }
      return {
        ...el,
        render: (data: string | number) => {
          if (data !== null && data !== undefined) {
            if (
              (el.key === 'borrowDate' || el.key === 'returnDate') &&
              typeof data === 'string'
            ) {
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
          pathname: `/human-resource/borrow-device-history/detail/${record.id}`,
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
          menuType={DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY}
        />
      }
      stateQuery={stateQuery}
      rowKey={(record: DeviceModel) => record.id}
      loading={isLoading}
      isShowScroll
      className={menuType === MENU_TYPE.ALL ? 'cursor-pointer' : ''}
      onRow={(record: DeviceModel) => {
        if (menuType === MENU_TYPE.ALL) return rowClickHandler(record);
      }}
    />
  );
}
