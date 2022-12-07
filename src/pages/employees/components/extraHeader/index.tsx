import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Col, notification, Row, Upload } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import { downloadFile } from 'components/DownloadFile';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { ACCESS_TOKEN, DATE_TIME } from 'constants/common';
import { ACTION_TYPE, EMPLOYEE_MENU } from 'constants/enums/common';
import { COMMON_STATUS_LIST } from 'constants/fixData';
import {
  DEPARTMENT,
  EMPLOYEE,
  POSITION_BY_DEPARTMENT,
} from 'constants/services';
import { EmployeeListQuery } from 'models/employee';
import moment from 'moment-timezone';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './extraHeaderEmployee.module.less';
interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  menuType: string;
  setStateQuery: Dispatch<SetStateAction<EmployeeListQuery>>;
  stateQuery: EmployeeListQuery;
  refetch?: () => {};
}
export default function ExtraHeaderTable({
  setIsShowDetailModal,
  modalAction,
  menuType,
  setStateQuery,
  stateQuery,
  refetch,
}: IProps) {
  const token = localStorage.getItem(ACCESS_TOKEN) || null;

  const departmentIdRef = useRef<number>(-1);
  const addEmployeeHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };
  const handleChangeFilter = (value: number, fieldName: string) => {
    setStateQuery((prev: EmployeeListQuery) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const downloadHandler = async () => {
    let url = `${EMPLOYEE.model.hr}/${EMPLOYEE.service}/${EMPLOYEE.model.export}`;
    const outputFilename = `employee-${getDateFormat(
      moment(),
      DATE_TIME,
    )}.xlsx`;
    delete stateQuery.limit;
    delete stateQuery.page;
    downloadFile(url, outputFilename, stateQuery);
  };
  const downloadTemplateHandler = async () => {
    let url = `${EMPLOYEE.model.hr}/${EMPLOYEE.model.template}/${EMPLOYEE.model.export}`;
    const outputFilename = `template-${getDateFormat(
      moment(),
      DATE_TIME,
    )}.xlsx`;
    downloadFile(url, outputFilename);
    refetch && refetch();
  };
  const getByTitle = () => {
    if (menuType === EMPLOYEE_MENU.ALL) {
      return 'All Employee List';
    }
    return 'Subordinate List';
  };

  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>{getByTitle()}</div>
        {menuType === EMPLOYEE_MENU.ALL && (
          <span>
            <div>
              <BasicButton
                title="Add Employee"
                type="filled"
                icon={<PlusOutlined />}
                onClick={addEmployeeHandler}
              />
              <BasicButton
                title="Download"
                type="outline"
                icon={<DownloadOutlined />}
                onClick={downloadHandler}
                className={styles.btn}
              />
              <Upload
                className={styles.btn}
                action={`${process.env.REACT_APP_API_URL}${EMPLOYEE.model.hr}/${EMPLOYEE.service}/${EMPLOYEE.model.import}`}
                headers={{ authorization: 'Bearer ' + token }}
                onChange={(info) => {
                  if (info.file.status === 'done') {
                    if (info.file.response?.data === 'OK') {
                      refetch && refetch();
                      notification.success({
                        message: info.file.response?.metadata?.message,
                      });
                    } else {
                      notification.error({
                        message: info.file.response?.metadata?.message,
                      });
                    }
                  } else {
                    if (info.file.response?.metadata?.message) {
                      notification.error({
                        message: info.file.response?.metadata?.message,
                        key: '1',
                      });
                    }
                  }
                }}
                showUploadList={false}
              >
                <BasicButton
                  title="Upload"
                  type="outline"
                  icon={<UploadOutlined />}
                />
              </Upload>
            </div>
            <div
              className={styles.btn__template}
              onClick={downloadTemplateHandler}
            >
              Download template
            </div>
          </span>
        )}
      </div>
      <div>
        <Row gutter={10} className={styles.filter__section}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Name, roll number"
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
              defaultValue={stateQuery?.search}
              label="Search"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <SelectCustomSearch
              url={DEPARTMENT.model.masterData}
              dataName="items"
              allowClear
              placeholder="Choose department"
              onChangeHandle={(value) => {
                handleChangeFilter(value, 'departmentId');
                if (!value) departmentIdRef.current = -1;
                if (value) departmentIdRef.current = value;
              }}
              apiName="department-master-data"
              defaultValue={stateQuery?.departmentId ?? undefined}
              label="Department"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <SelectCustomSearch
              url={`${POSITION_BY_DEPARTMENT.service}?departmentId=${departmentIdRef.current}`}
              dataName="items"
              placeholder="Choose position"
              allowClear
              optionFilterProp="label"
              apiName="position-master-data"
              onChangeHandle={(value) => {
                handleChangeFilter(value, 'positionId');
              }}
              refetchValue={departmentIdRef.current}
              defaultValue={stateQuery?.positionId ?? undefined}
              label="Position"
            />
          </Col>
          <Col span={4}>
            <BasicSelect
              options={COMMON_STATUS_LIST}
              placeholder="Request status"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={(value) => {
                handleChangeFilter(value, 'isActive');
              }}
              defaultValue={stateQuery?.isActive ?? undefined}
              label="Request Status"
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
