import { Tooltip } from 'antd';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import SvgIcon from 'components/SvgIcon';
import { paginationConfig } from 'constants/common';
import { ACTION_TYPE, DEVICE_MENU, STATUS } from 'constants/enums/common';
import { AllDeviceListHeader } from 'constants/header';
import { DEVICE } from 'constants/services';
import { useDeviceList } from 'hooks/useDevice';
import { HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import ExtraHeaderDevice from 'pages/device/components/extraHeader';
import MenuTableDevice from 'pages/device/components/menuTableDevice';
import DeviceStatus from 'pages/device/components/statusDevice';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEmptyPagination, removeEmptyValueInObject } from 'utils/common';
import DetailModalDevice from '../detailModalDevice';
// import dataMock from './dataMock.json';

export default function AllDiviceList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const deviceIdRef = useRef<number | undefined>();
  const modalAction = useRef(ACTION_TYPE.CREATE);
  // * defailt filters
  const defaultFilter: DeviceListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
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
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch: refetchList,
  } = useDeviceList(stateQuery, `${DEVICE.model.itSupport}/${DEVICE.service}`);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'deviceCode') {
        el.width = 250;
      } else if (el.key === 'deviceName') {
        el.width = 350;
      } else if (el.key === 'description') {
        el.width = 350;
      } else if (el.key === 'deviceTypeName') {
        el.width = 250;
      } else if (el.key === 'isUsed') {
        el.width = 150;
      }
      return {
        ...el,
        render: (data: any, record: DeviceModel) => {
          if (data !== null && data !== undefined) {
            if (el.key === 'isUsed') {
              if (data) return <DeviceStatus data={STATUS.USING} />;
              return <DeviceStatus data={STATUS.AVAILABLE} />;
            }
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
    });
    columns.push({
      title: (
        <div>
          <Tooltip
            title="Can not edit or delete devices are currently in use"
            placement="topRight"
          >
            Action <SvgIcon icon="infor" size={18} />
          </Tooltip>
        </div>
      ),
      key: 'action',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record: DeviceModel) => {
        if (!record?.isUsed) {
          return (
            <MenuTableDevice
              menuType={DEVICE_MENU.DEVICE_MANAGEMENT}
              record={record}
              setIsShowDetailModal={setIsShowDetailModal}
              deviceIdRef={deviceIdRef}
              modalAction={modalAction}
              stateQuery={stateQuery}
              refetch={refetchList}
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
  const cancelModalHandler = () => {
    setIsShowDetailModal(false);
    deviceIdRef.current = undefined;
  };
  const rowClickHandler = (deviceId: number) => {
    return {
      onClick: () => {
        setIsShowDetailModal(true);
        deviceIdRef.current = deviceId;
        modalAction.current = ACTION_TYPE.VIEW_DETAIL;
      },
    };
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
            menuType={DEVICE_MENU.DEVICE_MANAGEMENT}
            modalAction={modalAction}
          />
        }
        stateQuery={stateQuery}
        rowKey={(record: DeviceModel) => record.id}
        loading={isLoading}
        isShowScroll
        onRow={(record: DeviceModel) => {
          return rowClickHandler(record.id);
        }}
        className={'cursor-pointer'}
      />
      {isShowDetailModal && (
        <DetailModalDevice
          action={modalAction.current}
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          deviceIdRef={deviceIdRef.current}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
