import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE } from 'constants/enums/common';
import { COMMON_STATUS_LIST } from 'constants/fixData';
import { DEPARTMENT } from 'constants/services';
import { DepartmentListQuery } from 'models/department';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import styles from './extraHeaderDepartment.module.less';

interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  setStateQuery: Dispatch<SetStateAction<DepartmentListQuery>>;
}
export default function ExtraHeaderDepartment({
  setIsShowDetailModal,
  modalAction,
  setStateQuery,
}: IProps) {
  const handleChangeFilter = (value: number, fieldName: string) => {
    setStateQuery((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Department List</div>
        <BasicButton
          title="Add Department"
          type="filled"
          icon={<PlusOutlined />}
          onClick={() => setIsShowDetailModal(true)}
        />
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
              url={DEPARTMENT.model.masterData}
              dataName="items"
              allowClear
              placeholder="Choose department"
              onChangeHandle={(value) => {
                handleChangeFilter(value, 'departmentId');
              }}
              apiName="department-master-data"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={4}>
            <BasicSelect
              options={COMMON_STATUS_LIST}
              placeholder="Choose Status"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={(value) => {
                handleChangeFilter(value, 'status');
              }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}
