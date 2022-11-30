import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import {
  COMMON_STATUS,
  DATE_TIME_US,
  paginationConfig,
} from 'constants/common';
import {
  ACTION_TYPE,
  DEVICE_MENU,
  MENU_OPTION_KEY,
  STATUS,
} from 'constants/enums/common';
import { BorrowDeviceListHeader } from 'constants/header';
import { REQUEST } from 'constants/services';
import { useRequestList } from 'hooks/useRequestList';
import { HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import {
  RequestListQuery,
  RequestListSortFields,
  RequestModel,
} from 'models/request';
import ExtraHeaderDevice from 'pages/device/components/extraHeader';
import DeviceMenuTable from 'pages/device/components/menuTableDevice';
import DeviceStatus from 'pages/device/components/statusDevice';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertDate,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import DeviceAssignModal from '../deviceAssignModal';
// import dataMock from './dataMock.json';

export default function BorrowDeviceRequest() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const requestIdRef = useRef<number>();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  // * default feilters
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
    approvalDateFrom: searchParams.get('approvalDateFrom') ?? undefined,
    approvalDateTo: searchParams.get('approvalDateTo') ?? undefined,
    isAssigned: searchParams.get('isAssigned')
      ? Number(searchParams.get('isAssigned'))
      : undefined,
    deviceTypeId: searchParams.get('deviceTypeId')
      ? Number(searchParams.get('deviceTypeId'))
      : undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = BorrowDeviceListHeader;
  // * get data table from API
  const {
    isLoading,
    data: dataTable,
    refetch: refetchList,
  } = useRequestList(
    stateQuery,
    `${REQUEST.model.itSupport}/${REQUEST.service}`,
  );
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      if (el.key === 'rollNumber') {
        el.width = 150;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (el.key === 'isAssigned') {
        el.width = 100;
      } else if (el.key === 'deviceTypeName' || el.key === 'approvalDate') {
        el.width = 200;
      } else if (el.key === 'createDate') {
        el.width = 200;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (
        el.key === 'reason' ||
        el.key === 'personName' ||
        el.key === 'receiver'
      ) {
        el.width = 200;
      }
      return {
        ...el,
        render: (data: string | number, record: RequestModel) => {
          if (data !== undefined) {
            if (
              (el.key === 'createDate' || el.key === 'approvalDate') &&
              typeof data === 'string'
            ) {
              return convertDate(data, DATE_TIME_US);
            } else if (el.key === 'isAssigned') {
              return (
                <DeviceStatus
                  data={data === 0 ? STATUS.PENDING : STATUS.ASSIGNED}
                />
              );
            }

            return data;
          } else {
            return '-';
          }
        },
      };
    });
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 80,
      align: 'center',
      render: (_, record: DeviceModel) => {
        if (!record?.isAssigned) {
          return (
            <DeviceMenuTable
              record={record}
              onClickMenu={menuActionHandler}
              menuType={DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST}
              // refetchList={refetchList}
              // setIsShowDetailModal={setIsShowDetailModal}
              // modalAction={modalAction}
            />
          );
        }
        return '-';
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataTable && dataTable?.data) {
      const {
        metadata: { pagination },
        data: { items: requestList },
      } = dataTable;
      setRecords(requestList);
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
  }, [dataTable]);
  const menuActionHandler = (
    record: DeviceModel,
    action: MENU_OPTION_KEY,
  ) => {};
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    let sort = stateQuery.sort;
    let dir = stateQuery.dir;

    if (sorter.order) {
      const sortField = sorter.field as RequestListSortFields;
      const sortDirections = sorter.order === 'ascend' ? 'asc' : 'desc';

      sort = `${sortField}`;
      dir = sortDirections;
    }

    // * set changing of pagination to state query
    setStateQuery((prev: RequestListQuery) => ({
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
        requestIdRef.current = record.id;
        modalAction.current =
          record?.isAssigned === COMMON_STATUS.ACTIVE
            ? ACTION_TYPE.VIEW_DETAIL
            : ACTION_TYPE.ASSIGN;
        setIsShowDetailModal(true);
      },
    };
  };
  const cancelModalHandler = () => {
    requestIdRef.current = 0;
    setIsShowDetailModal(false);
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
            modalAction={modalAction}
            setStateQuery={setStateQuery}
            menuType={DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST}
            stateQuery={stateQuery}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: RequestModel) => record.id}
        isShowScroll
        className={'cursor-pointer'}
        onRow={(record: RequestModel) => {
          return rowClickHandler(record);
        }}
        loading={isLoading}
      />
      {isShowDetailModal && (
        <DeviceAssignModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          requestIdRef={requestIdRef.current}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
