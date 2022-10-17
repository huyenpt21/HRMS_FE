import { Col, Row, TablePaginationConfig, Tooltip } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicSelect from 'components/BasicSelect';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { STATUS, STATUS_COLORS } from 'constants/enums/common';
import { REQUEST_TYPE_LIST } from 'constants/fixData';
import { SubordinateRequestListHeader } from 'constants/header';
import { HeaderTableFields, StatusTag } from 'models/common';
import {
  RequestListModel,
  RequestListQuery,
  RequestListSortFields,
} from 'models/request';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  convertDate,
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import dataMock from './dataMock.json';
import styles from './subordinateRequestList.module.less';

export default function SubordinateRequestList() {
  const [searchParams] = useSearchParams();
  const [pagination, setPagination] = useState(paginationConfig);
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
  const header: HeaderTableFields[] = SubordinateRequestListHeader;

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
      } else if (el.key === 'requestType' || el.key === 'personName') {
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
              <Tooltip title="Approve">
                <span
                  onClick={() => actionRequestHandler(record.id)}
                  className="cursor-pointer"
                >
                  <SvgIcon icon="accept-circle" />
                </span>
              </Tooltip>
              <Tooltip title="Reject">
                <span
                  onClick={() => actionRequestHandler(record.id)}
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

  const actionRequestHandler = (requestId: string) => {};

  const extraHeader = (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>My Request List</div>
      </div>
      <div className={styles.header__container}>
        <Row gutter={20} className={styles.filter__section}>
          <Col span={6}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
              label="Employee Name"
            />
          </Col>
          <Col span={6}>
            <BasicDateRangePicker
              placeholder={['From', 'To']}
              label="Create Date"
            />
          </Col>
          <Col span={4}>
            <BasicSelect
              options={REQUEST_TYPE_LIST}
              placeholder="Request Type"
              label="Request Type"
              allowClear
              showSearch
              optionFilterProp="children"
            />
          </Col>
        </Row>
      </div>
    </>
  );
  return (
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
      // onRow={(record: RequestListModel) => {
      //   return rowClickHandler(record);
      // }}
    />
  );
}
