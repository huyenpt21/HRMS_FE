import { PlusOutlined } from '@ant-design/icons';
import { Col, Row, TablePaginationConfig, Tooltip } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicSelect from 'components/BasicSelect';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { ACTION_TYPE, STATUS, STATUS_COLORS } from 'constants/enums/common';
import { MyRequestListHeader } from 'constants/header';
import { HeaderTableFields, StatusTag } from 'models/common';
import {
  RequestListModel,
  RequestListQuery,
  RequestListSortFields,
} from 'models/request';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertDate,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import RequestDetailModal from '../RequestDetailModal';
import dataMock from './dataMock.json';
import styles from './requestList.module.less';

export default function MyRequestList() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
  const requestId = useRef('');
  const requestStatus = useRef<string | undefined>(STATUS.PENDING);
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<RequestListModel[]>([]);
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

  // * get header and data table
  const header: HeaderTableFields[] = MyRequestListHeader;

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
      } else if (el.key === 'requestType') {
        el.width = 200;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (el.key === 'status') {
        el.width = 100;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
        el.filterMultiple = true;
        el.filters = [
          { text: STATUS.PENDING, value: STATUS.PENDING },
          { text: STATUS.APPROVED, value: STATUS.APPROVED },
          { text: STATUS.REJECTED, value: STATUS.REJECTED },
        ];
      } else if (el.key === 'reason') {
        el.width = 200;
      } else {
        el.width = 200;
      }
      return {
        ...el,
        render: (data: any, record: RequestListModel) => {
          if (data) {
            if (
              el.key === 'createDate' ||
              el.key === 'startTime' ||
              el.key === 'endTime'
            ) {
              return convertDate(data, DATE_TIME_US);
            } else if (el.key === 'status') {
              let statusTag: StatusTag = {
                statusColor: STATUS_COLORS.PROCESSING,
                text: '',
              };
              switch (data) {
                case STATUS.PENDING: {
                  statusTag = {
                    statusColor: STATUS_COLORS.WARING,
                    text: STATUS.PENDING,
                  };
                  break;
                }
                case STATUS.APPROVED: {
                  statusTag = {
                    statusColor: STATUS_COLORS.SUCCESS,
                    text: STATUS.APPROVED,
                  };
                  break;
                }
                case STATUS.REJECTED: {
                  statusTag = {
                    statusColor: STATUS_COLORS.ERROR,
                    text: STATUS.REJECTED,
                  };
                  break;
                }
              }
              return (
                <BasicTag
                  statusColor={statusTag.statusColor}
                  text={statusTag.text}
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
      width: 60,
      align: 'left',
      render: (_, record: RequestListModel) => {
        if (record?.status === STATUS.PENDING) {
          return (
            <div
              className={styles.menu__action}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Tooltip title="Edit">
                <span
                  onClick={() => editRequestHandler(record.id)}
                  className="cursor-pointer"
                >
                  <SvgIcon icon="edit-border" />
                </span>
              </Tooltip>
              <Tooltip title="Cancel">
                <span
                  onClick={() => cancelRequestHandler(record.id)}
                  className="cursor-pointer"
                >
                  <SvgIcon icon="close-circle" />
                </span>
              </Tooltip>
            </div>
          );
        }
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery]);

  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataMock && dataMock.data) {
      const {
        metadata: { pagination },
        data: { requestList },
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
    }
  }, []);

  const editRequestHandler = (id: string) => {
    requestId.current = id;
    modalAction.current = ACTION_TYPE.VIEW_DETAIL;
    setIsShowDetailModal(true);
  };
  const cancelRequestHandler = (requestId: string) => {};

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

    // * set filter to state query
    const filterKey: any = Object.keys(filters)[0];
    const filterValues: any = Object.values(filters)[0];
    setStateQuery((prev: RequestListQuery) => ({
      ...prev,
      [filterKey]: filterValues,
    }));
  };

  const cancelModalHandler = () => {
    requestStatus.current = STATUS.PENDING;
    requestId.current = '';
    setIsShowDetailModal(false);
  };

  const addRequestHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };

  const rowClickHandler = (record: RequestListModel) => {
    return {
      onClick: () => {
        requestId.current = record.id;
        modalAction.current = ACTION_TYPE.VIEW_DETAIL;
        setIsShowDetailModal(true);
        requestStatus.current = record.status;
      },
    };
  };

  const extraHeader = (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>My Request List</div>
        <BasicButton
          title="Add Request"
          type="filled"
          icon={<PlusOutlined />}
          onClick={addRequestHandler}
        />
      </div>
      <div className={styles.header__container}>
        <Row gutter={20} className={styles.filter__section}>
          <Col span={10}>
            <BasicDateRangePicker
              placeholder={['From', 'To']}
              label="Create Date"
            />
          </Col>
          <Col span={10}>
            <BasicSelect
              options={[]}
              placeholder="Request Type"
              label="Request Type"
              allowClear
            />
          </Col>
        </Row>
      </div>
    </>
  );

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={extraHeader}
        stateQuery={stateQuery}
        rowKey={(record: RequestListModel) => record.id}
        scroll={{ y: 240 }}
        className={'cursor-pointer'}
        onRow={(record: RequestListModel) => {
          return rowClickHandler(record);
        }}
      />
      {isShowDetailModal && (
        <RequestDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          action={modalAction.current}
          requestId={requestId.current}
          requestStatus={requestStatus.current}
          // refetchList={refetchList}
        />
      )}
    </>
  );
}
