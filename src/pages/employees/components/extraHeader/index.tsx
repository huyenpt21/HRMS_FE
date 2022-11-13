import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE, EMPLOYEE_MENU } from 'constants/enums/common';
import { DEPARTMENT, POSITION_BY_DEPARTMENT } from 'constants/services';
import { EmployeeListQuery } from 'models/employee';
import { Dispatch, MutableRefObject, SetStateAction, useRef } from 'react';
import styles from './extraHeaderEmployee.module.less';
interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  menuType: string;
  setStateQuery: Dispatch<SetStateAction<EmployeeListQuery>>;
}
export default function ExtraHeaderTable({
  setIsShowDetailModal,
  modalAction,
  menuType,
  setStateQuery,
}: IProps) {
  const departmentIdRef = useRef<string>('');
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
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Employee List</div>
        {menuType === EMPLOYEE_MENU.ALL && (
          <BasicButton
            title="Add Employee"
            type="filled"
            icon={<PlusOutlined />}
            onClick={addEmployeeHandler}
          />
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
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <SelectCustomSearch
              url={DEPARTMENT.service}
              dataName="items"
              allowClear
              placeholder="Choose department"
              onChangeHandle={(value) => {
                handleChangeFilter(value, 'departmentId');
                if (!value) departmentIdRef.current = '';
                if (value) departmentIdRef.current = value;
              }}
              apiName="department-master-data"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <SelectCustomSearch
              url={`${POSITION_BY_DEPARTMENT.service}?departmentId=${departmentIdRef.current}`}
              dataName="items"
              placeholder="Position"
              allowClear
              optionFilterProp="label"
              apiName="position-master-data"
              onChangeHandle={(value) => {
                handleChangeFilter(value, 'positionId');
              }}
              refetchValue={departmentIdRef.current}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
