import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE, EMPLOYEE_MENU } from 'constants/enums/common';
import { POSITION_WORKING } from 'constants/fixData';
import { EmployeeListQuery } from 'models/employee';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
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
  const addEmployeeHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };
  const handleChangePosition = (value: number) => {
    setStateQuery((prev: any) => ({
      ...prev,
      position: value,
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
          <Col span={4}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
            />
          </Col>
          <Col span={4}>
            <BasicSelect options={[]} placeholder="Department" />
          </Col>
          <Col span={4}>
            <BasicSelect
              options={POSITION_WORKING}
              placeholder="Position"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={handleChangePosition}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}