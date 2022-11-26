import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { ACTION_TYPE, REQUEST_MENU, STATUS } from 'constants/enums/common';
import { SubordinateRequestListHeader } from 'constants/header';
import { REQUEST } from 'constants/services';
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
import RequestDetailModal from '../detailModal';
import ExtraTableHeader from '../components/extraHeader';
import RequestMenuAction from '../components/menuAction';
import RequestStatus from '../components/statusRequest';
// import dataMock from '../dataMock.json';

export default function SubordinateRequestList() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const requestIdRef = useRef<number>();
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
    search: searchParams.get('search') ?? undefined,
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
  let header: HeaderTableFields[] = SubordinateRequestListHeader;
  // * get data table from API
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch: refetchList,
  } = useRequestList(stateQuery, `${REQUEST.model.manager}/${REQUEST.service}`);
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
      } else if (el.key === 'rollNumber') {
        el.width = 120;
        el.sorter = !isError;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (
        el.key === 'requestTypeName' ||
        el.key === 'reason' ||
        el.key === 'personName'
      ) {
        el.width = 200;
      } else if (el.key === 'status') {
        el.width = 100;
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
      render: (_, record: RequestModel) => {
        return (
          <RequestMenuAction
            record={record}
            tabType={REQUEST_MENU.SUBORDINATE}
            refetchList={refetchList}
            requestStatus={record?.status}
          />
        );
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
      onClick: () => {
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
            tabType={REQUEST_MENU.SUBORDINATE}
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
          tabType={REQUEST_MENU.SUBORDINATE}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
