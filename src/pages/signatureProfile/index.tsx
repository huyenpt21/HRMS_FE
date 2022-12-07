import { Col, notification, Row } from 'antd';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import BasicSelect from 'components/BasicSelect';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES, paginationConfig } from 'constants/common';
import { ACTION_TYPE, MENU_OPTION_KEY, STATUS } from 'constants/enums/common';
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
  isEmptyPagination,
  removeEmptyValueInObject,
  sortInforWithDir,
} from 'utils/common';
import SignatureMenuTable from './components/signatureMenuTable';
import SignatureStatus from './components/signatureStatus';
import dataMock from './dataMock.json';
import SignatureRegisterModal from './modalRegister';
import styles from './signatureProfile.module.less';

export default function SignatureProfileList() {
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<SignatureProfileModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const signatureIdRef = useRef<string | undefined>();
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const modalAction = useRef(ACTION_TYPE.CREATE);
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
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
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
      } else if (el.key === 'idSignature') {
        el.width = 300;
        el.sorter = true;
        el.sortOrder = sortInforWithDir(el.key, stateQuery);
      } else if (el.key === 'employeeName') {
        el.width = 300;
      } else if (el.key === 'isRegistered') {
        el.width = 150;
        el.align = 'center';
      }
      return {
        ...el,
        render: (data: any, record: SignatureProfileModel) => {
          if (data !== null && data !== undefined) {
            if (el.key === 'isRegistered') {
              if (data) return <SignatureStatus data={STATUS.REGISTERED} />;
              return <SignatureStatus data={STATUS.PENDING} />;
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
    } else {
      const {
        metadata: { pagination },
        data: { items: recordsTable },
      } = dataMock;
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
  const menuActionHandler = (
    record: SignatureProfileModel,
    action: MENU_OPTION_KEY,
  ) => {
    switch (action) {
      case MENU_OPTION_KEY.EDIT: {
        signatureIdRef.current = record?.idSignature;
        modalAction.current = ACTION_TYPE.EDIT;
        break;
      }
      case MENU_OPTION_KEY.DELETE: {
        record?.idSignature && deleteSignature(record?.idSignature);
      }
    }
  };
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: SorterResult<object>,
  ) => {
    // * set changing of pagination to state query
    setStateQuery((prev: SignatureProfileListQuery) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const rowClickHandler = (idSignature?: string) => {
    return {
      onClick: () => {
        signatureIdRef.current = idSignature;
        modalAction.current = ACTION_TYPE.VIEW_DETAIL;
        setIsShowDetailModal(true);
      },
    };
  };
  const cancelModalHandler = () => {
    setIsShowDetailModal(false);
    signatureIdRef.current = undefined;
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
                      isRegister: value,
                    }));
                  }}
                  defaultValue={stateQuery?.isActive ?? undefined}
                />
              </Col>
            </Row>
          </>
        }
        stateQuery={stateQuery}
        rowKey={(record: SignatureProfileModel) => record.id}
        loading={isLoading}
        isShowScroll
        onRow={(record: SignatureProfileModel) => {
          return rowClickHandler(record?.idSignature);
        }}
        className={'cursor-pointer'}
      />
      {isShowDetailModal && (
        <SignatureRegisterModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
          refetchList={refetch}
          signatureIdRef={signatureIdRef.current}
        />
      )}
    </>
  );
}
