import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DeviceTypeListQuery } from 'models/device';
import { Dispatch, SetStateAction } from 'react';
import styles from './extraHeaderDepartment.module.less';

interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  setStateQuery: Dispatch<SetStateAction<DeviceTypeListQuery>>;
}
export default function ExtraHeaderDeviceType({
  setIsShowDetailModal,
  setStateQuery,
}: IProps) {
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>Device Type List</div>
        <BasicButton
          title="Add Device Type"
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
        </Row>
      </div>
    </>
  );
}
