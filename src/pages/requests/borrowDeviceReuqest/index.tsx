import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { ACTION_TYPE, REQUEST_MENU } from 'constants/enums/common';
import { BorrowDeviceListHeader } from 'constants/header';
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
import RequestDetailModal from '../components/detailModal';
import ExtraTableHeader from '../components/extraHeader';
import RequestStatus from '../components/statusRequest';
import dataMock from './dataMock.json';

export default function BorrowDeviceRequest() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const requestIdRef = useRef<number>();
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
      } else if (
        el.key === 'deviceTypeName' ||
        el.key === 'approvalDate' ||
        el.key === 'createDate'
      ) {
        el.width = 200;
      } else if (el.key === 'reason' || el.key === 'personName') {
        el.width = 200;
      }
      return {
        ...el,
        render: (data: any) => {
          if (data) {
            if (el.key === 'createDate' || el.key === 'approvalDate') {
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
    setColumnsHeader(columns);
  }, [stateQuery]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    // if (dataTable && dataTable?.data) {
    const {
      metadata: { pagination },
      data: { items: requestList },
    } = dataMock;
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
    // }
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
          <ExtraTableHeader
            setIsShowDetailModal={setIsShowDetailModal}
            modalAction={modalAction}
            setStateQuery={setStateQuery}
            tabType={REQUEST_MENU.ALL}
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
          tabType={REQUEST_MENU.ALL}
          refetchList={refetchList}
        />
      )}
    </>
  );
}
