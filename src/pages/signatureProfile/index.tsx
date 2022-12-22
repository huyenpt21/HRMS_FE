import { Col, Row } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { paginationConfig } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { SignatureProfileListHeader } from 'constants/header';
import { useSignatureList } from 'hooks/useSignatureProfile';
import { HeaderTableFields } from 'models/common';
import {
  SignatureProfileListQuery,
  SignatureProfileModel,
} from 'models/signatureProfile';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
} from 'utils/common';
import SignatureMenuTable from './components/signatureMenuTable';
import SignatureStatus from './components/signatureStatus';
// import dataMock from './dataMock.json';
import styles from './signatureProfile.module.less';

export default function SignatureProfileList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<SignatureProfileModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  // * defailt filters
  const defaultFilter: SignatureProfileListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
    isRegistered: searchParams.get('isRegistered')
      ? Number(searchParams.get('isRegistered'))
      : undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState<SignatureProfileListQuery>(
    removeEmptyValueInObject(defaultFilter),
  );
  //  * get data header and content table
  const header: HeaderTableFields[] = SignatureProfileListHeader;
  const {
    isLoading,
    isError,
    data: dataTable,
    refetch,
  } = useSignatureList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'rollNumber') {
        el.width = 150;
      } else if (el.key === 'registeredDate') {
        el.width = 300;
      } else if (el.key === 'employeeName') {
        el.width = 300;
      } else if (el.key === 'isRegistered') {
        el.width = 150;
        el.align = 'center';
      }
      return {
        ...el,
        render: (data: any, record: SignatureProfileModel) => {
          if (data !== null && data !== undefined && data !== '') {
            if (el.key === 'isRegistered') {
              if (data) return <SignatureStatus data={STATUS.REGISTERED} />;
              return <SignatureStatus data={STATUS.PENDING} />;
            }
            if (el.key === 'registeredDate') {
              return getDateFormat(data, 'MM/DD/YYYY HH:mm:ss');
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
      render: (_, record: SignatureProfileModel) => {
        return <SignatureMenuTable record={record} refetch={refetch} />;
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, isError]);
  // * get data source from API and set to state that store records for table
  useEffect(() => {
    if (dataTable && dataTable.data) {
      const {
        metadata: { pagination },
        data: { item: recordsTable },
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

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // * set changing of pagination to state query
    setStateQuery((prev: SignatureProfileListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  return (
    <>
      <CommonTable
        columns={columnsHeader}
        data={records}
        onChange={handleTableChange}
        pagination={pagination}
        extra={
          <>
            <div className={styles.header__section}>
              <div className={styles.header__title}>Signature Profile List</div>
            </div>
            <Row gutter={20} className={styles.filter__section}>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <InputDebounce
                  suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                  placeholder="Search ..."
                  label="Employee Name"
                  allowClear
                  setStateQuery={setStateQuery}
                  keyParam="search"
                  defaultValue={stateQuery?.search}
                />
              </Col>
            </Row>
          </>
        }
        stateQuery={stateQuery}
        rowKey={(record: SignatureProfileModel) => record?.registeredDate}
        loading={isLoading}
        isShowScroll
        className={'cursor-pointer'}
      />
    </>
  );
}
