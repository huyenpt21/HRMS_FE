import { TablePaginationConfig } from 'antd';
import { SorterResult } from 'antd/lib/table/interface';
import BasicTag from 'components/BasicTag';
import CommonTable from 'components/CommonTable';
import MenuOptions from 'components/MenuOpstions';
import { DATE_TIME_US, paginationConfig } from 'constants/common';
import { STATUS, STATUS_COLORS } from 'constants/enums/common';
import { MENU_COMMON } from 'constants/fixData';
import { MyRequestListHeader } from 'constants/header';
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
} from 'utils/common';
import dataMock from './dataMock.json';

export default function MyRequestList() {
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
      } else if (el.key === 'status') {
        el.width = 100;
      } else {
        el.width = 200;
      }
      return {
        ...el,
        render: (data: any, record: RequestListModel) => {
          if (
            el.key === 'createDate' ||
            el.key === 'startTime' ||
            el.key === 'endTime'
          ) {
            return convertDate(data, DATE_TIME_US);
          }
          if (el.key === 'status') {
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
          return <div>{data}</div>;
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
            <MenuOptions
              trigger={['click']}
              items={MENU_COMMON}
              itemHandler={menuActionHandler}
              itemSelected={record}
            />
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

  const menuActionHandler = () => {};

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

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={<></>}
        stateQuery={stateQuery}
        rowKey={(record: RequestListModel) => record.id}
        scroll={{ y: 240 }}
      />
    </>
  );
}
