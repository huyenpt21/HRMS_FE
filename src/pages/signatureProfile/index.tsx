import { Col, notification, Row } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table/interface';
import BasicSelect from 'components/BasicSelect';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME, MESSAGE_RES, paginationConfig } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { SIGNATURE_STATUS_LIST } from 'constants/fixData';
import { SignatureProfileListHeader } from 'constants/header';
import {
  useDeleteSignature,
  useGteSignatureList,
} from 'hooks/useSignatureProfile';
import { HeaderTableFields } from 'models/common';
import {
  ResSignatureProfileModify,
  SignatureProfileListQuery,
  SignatureProfileModel,
} from 'models/signatureProfile';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDateFormat,
  isEmptyPagination,
  removeEmptyValueInObject,
} from 'utils/common';
import SignatureMenuTable from './components/signatureMenuTable';
import SignatureStatus from './components/signatureStatus';
// import dataMock from './dataMock.json';
import SignatureRegisterModal from './modalRegister';
import styles from './signatureProfile.module.less';

export default function SignatureProfileList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<SignatureProfileModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const registeredDateRef = useRef<string | undefined>();
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
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
  } = useGteSignatureList(stateQuery);
  const { mutate: deleteSignature } = useDeleteSignature({
    onSuccess: (response: ResSignatureProfileModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({
          message: 'Update information successfully',
        });
        refetch();
      }
    },
    onError: (response: ResSignatureProfileModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({
        message: message,
      });
    },
  });
  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      // * enable sort in column
      if (el.key === 'id') {
        el.width = 60;
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
          if (data !== null && data !== undefined && !!data) {
            if (el.key === 'isRegistered') {
              if (data) return <SignatureStatus data={STATUS.REGISTERED} />;
              return <SignatureStatus data={STATUS.PENDING} />;
            }
            if (el.key === 'registeredDate') {
              return getDateFormat(data, DATE_TIME);
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
        return (
          <SignatureMenuTable
            record={record}
            onClickMenu={menuActionHandler}
            setIsShowDetailModal={setIsShowDetailModal}
            registeredDateRef={registeredDateRef}
          />
        );
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
  const menuActionHandler = (record: SignatureProfileModel) => {
    record?.personId && deleteSignature(record?.personId);
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    // * set changing of pagination to state query
    setStateQuery((prev: SignatureProfileListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };
  const cancelModalHandler = () => {
    registeredDateRef.current = undefined;
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
          <>
            <div className={styles.header__section}>
              <div className={styles.header__title}>Signature Profile List</div>
            </div>
            <Row gutter={20} className={styles.filter__section}>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <InputDebounce
                  suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                  placeholder="Employee name"
                  label="Search"
                  allowClear
                  setStateQuery={setStateQuery}
                  keyParam="search"
                  defaultValue={stateQuery?.search}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <BasicSelect
                  options={SIGNATURE_STATUS_LIST}
                  placeholder="Signature status"
                  allowClear
                  showSearch
                  label="Status"
                  optionFilterProp="label"
                  onChange={(value) => {
                    setStateQuery((prev: SignatureProfileListQuery) => ({
                      ...prev,
                      isRegistered: value,
                    }));
                  }}
                  defaultValue={stateQuery?.isRegistered}
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
      {isShowDetailModal && (
        <SignatureRegisterModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          refetchList={refetch}
          registeredDateRef={registeredDateRef.current}
        />
      )}
    </>
  );
}
