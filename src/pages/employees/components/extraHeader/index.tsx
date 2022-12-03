import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Col, notification, Row, Upload } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { ACTION_TYPE, EMPLOYEE_MENU } from 'constants/enums/common';
import { COMMON_STATUS_LIST } from 'constants/fixData';
import {
  DEPARTMENT,
  EMPLOYEE,
  POSITION_BY_DEPARTMENT,
} from 'constants/services';
import { useDownloadEmployeeList } from 'hooks/useEmployee';
import { EmployeeListQuery, ResEmployeeModify } from 'models/employee';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import styles from './extraHeaderEmployee.module.less';
interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  menuType: string;
  setStateQuery: Dispatch<SetStateAction<EmployeeListQuery>>;
  stateQuery: EmployeeListQuery;
}
export default function ExtraHeaderTable({
  setIsShowDetailModal,
  modalAction,
  menuType,
  setStateQuery,
  stateQuery,
}: IProps) {
  const departmentIdRef = useRef<number>(-1);
  const { mutate: downloadFile } = useDownloadEmployeeList({
    onSuccess: () => {},
    onError: (response: ResEmployeeModify) => {
      const {
        metadata: { message },
      } = response;
      if (message !== MESSAGE_RES.SUCCESS) {
        notification.error({ message: message });
      }
    },
  });
  const addEmployeeHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };
  const handleChangeFilter = (value: number, fieldName: string) => {
    setStateQuery((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const downloadHandler = () => {
    delete stateQuery.limit;
    delete stateQuery.page;
    downloadFile(stateQuery);
  };

  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Employee List</div>
        {menuType === EMPLOYEE_MENU.ALL && (
          <span>
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
            >
              <BasicButton
                title="Upload"
                type="outline"
                icon={<UploadOutlined />}
              />
            </Upload>
          </span>
        )}
      </div>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
              defaultValue={stateQuery?.search}
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
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
