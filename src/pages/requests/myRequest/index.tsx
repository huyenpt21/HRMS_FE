import { TablePaginationConfig, Tooltip } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { ACTION_TYPE, REQUEST_MENU, STATUS } from 'constants/enums/common';
import { MyRequestListHeader } from 'constants/header';
import { useRequestList } from 'hooks/useRequestList';
import { HeaderTableFields } from 'models/common';
import {
  RequestListQuery,
  RequestListSortFields,
  RequestModel,
} from 'models/request';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertDate,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import ExtraTableHeader from '../components/extraHeader';
import RequestMenuAction from '../components/menuAction';
import RequestStatus from '../components/statusRequest';
import RequestDetailModal from '../detailModal';
// import dataMock from '../dataMock.json';
import SvgIcon from 'components/SvgIcon';

export default function MyRequestList() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const requestIdRef = useRef<number>(0);
  const requestStatus = useRef<string | undefined>(STATUS.PENDING);
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<RequestModel[]>([]);
  // * default feilters
  const defaultFilter: RequestListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
    createDateFrom: searchParams.get('createDateFrom') ?? undefined,
    createDateTo: searchParams.get('createDateTo') ?? undefined,
    requestTypeId: searchParams.get('requestTypeId')
      ? Number(searchParams.get('requestTypeId'))
      : undefined,
    status: searchParams.get('status') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  // * get header
  let header: HeaderTableFields[] = MyRequestListHeader;
  // * get data table from API
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch: refetchList,
  } = useRequestList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * eanble sort in column & custom width
      if (
        el.key === 'createDate' ||
        el.key === 'startTime' ||
        el.key === 'endTime'
      ) {
        el.width = 150;
        el.sorter = !isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (el.key === 'requestTypeName') {
        el.width = 200;
      } else if (el.key === 'status') {
        el.width = 100;
      } else if (el.key === 'reason') {
        el.width = 180;
      }
      return {
        ...el,
        render: (data: any, record: RequestModel) => {
          if (data) {
            if (
              el.key === 'createDate' ||
              el.key === 'startTime' ||
              el.key === 'endTime'
            ) {
              return convertDate(data, DATE_TIME_US);
            } else if (el.key === 'status') {
              return <RequestStatus data={data} />;
            }
            return <span>{data}</span>;
          }
          return '-';
        },
      };
    });
    columns.push({
      title: (
        <div>
          <Tooltip
            title="Can only edit or cancel requests that are pending"
            placement="topRight"
          >
            Action <SvgIcon icon="infor" size={18} />
          </Tooltip>
        </div>
      ),
      key: 'action',
      dataIndex: 'action',
      width: 80,
      align: 'center',
      render: (data: any, record: RequestModel) => {
        if (record?.status === STATUS.PENDING) {
          return (
            <RequestMenuAction
              record={record}
              tabType={REQUEST_MENU.MY_REQUEST}
              setIsShowDetailModal={setIsShowDetailModal}
              modalAction={modalAction}
              requestIdRef={requestIdRef}
              refetchList={refetchList}
            />
          );
        } else {
          return '-';
        }
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataTable && dataTable?.data) {
      const {
        metadata: { pagination },
        data: { items },
      } = dataTable;
      setRecords(items);
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
  const rowClickHandler = (record: RequestModel) => {
    return {
      onClick: (e: any) => {
        e.stopPropagation();
        requestIdRef.current = record.id;
        modalAction.current = ACTION_TYPE.VIEW_DETAIL;
        setIsShowDetailModal(true);
        requestStatus.current = record.status;
      },
    };
  };
  const cancelModalHandler = () => {
    requestStatus.current = STATUS.PENDING;
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
          <ExtraTableHeader
            setIsShowDetailModal={setIsShowDetailModal}
            modalAction={modalAction}
            setStateQuery={setStateQuery}
            tabType={REQUEST_MENU.MY_REQUEST}
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
        <RequestDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          action={modalAction.current}
          requestIdRef={requestIdRef.current}
          requestStatus={requestStatus.current}
          tabType={REQUEST_MENU.MY_REQUEST}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
