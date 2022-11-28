import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE, DEVICE_MENU } from 'constants/enums/common';
import { DEVICE_STATUS } from 'constants/fixData';
import { DEVICE_TYPE } from 'constants/services';
import { DeviceListQuery } from 'models/device';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';
import styles from './extraHeaderDevice.module.less';

interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  setStateQuery: Dispatch<SetStateAction<DeviceListQuery>>;
  modalAction?: MutableRefObject<ACTION_TYPE>;
  menuType: string;
}
export default function ExtraHeaderDevice({
  setIsShowDetailModal,
  setStateQuery,
  menuType,
  modalAction,
}: IProps) {
  const getTitle = () => {
    let returnObject = {
      titlePage: '',
      titleBtn: '',
    };
    switch (menuType) {
      case DEVICE_MENU.DEVICE_TYPE: {
        returnObject.titlePage = 'Device Type List';
        returnObject.titleBtn = 'Add Device Type';
        break;
      }
      case DEVICE_MENU.ALL: {
        returnObject.titlePage = 'All Device List';
        returnObject.titleBtn = 'Add Device';
        break;
      }
    }
    return returnObject;
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>{getTitle().titlePage}</div>
        <BasicButton
          title={getTitle().titleBtn}
          type="filled"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsShowDetailModal(true);
            if (modalAction) modalAction.current = ACTION_TYPE.CREATE;
          }}
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
          {menuType !== DEVICE_MENU.DEVICE_TYPE && (
            <>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <SelectCustomSearch
                  url={`${DEVICE_TYPE.service}-${DEVICE_TYPE.model.masterData}`}
                  dataName="items"
                  apiName="device-type-master-data"
                  placeholder="Choose device type"
                  allowClear
                  onChangeHandle={(value) => {
                    setStateQuery((prev: DeviceListQuery) => ({
                      ...prev,
                      deviceTypeId: value,
                    }));
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <BasicSelect
                  options={DEVICE_STATUS}
                  placeholder="Choose status"
                  allowClear
                  onChange={(value) => {
                    setStateQuery((prev: DeviceListQuery) => ({
                      ...prev,
                      isUsed: value,
                    }));
                  }}
                />
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
}
