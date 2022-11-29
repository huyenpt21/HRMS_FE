import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE, DEVICE_MENU } from 'constants/enums/common';
import { BORROW_DEVICE_STATUS, DEVICE_STATUS } from 'constants/fixData';
import { DEVICE_TYPE } from 'constants/services';
import { DeviceListQuery } from 'models/device';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';
import styles from './extraHeaderDevice.module.less';

interface IProps {
  setIsShowDetailModal?: Dispatch<SetStateAction<boolean>>;
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
      case DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY: {
        returnObject.titlePage = 'All Borrow Device History';
        break;
      }
      case DEVICE_MENU.MY_BORROW_DEVICE_HISTORY: {
        returnObject.titlePage = 'My Borrow Device History';
        break;
      }
    }
    return returnObject;
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>{getTitle().titlePage}</div>
        {(menuType === DEVICE_MENU.DEVICE_TYPE ||
          menuType === DEVICE_MENU.ALL) && (
          <BasicButton
            title={getTitle().titleBtn}
            type="filled"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsShowDetailModal && setIsShowDetailModal(true);
              if (modalAction) modalAction.current = ACTION_TYPE.CREATE;
            }}
          />
        )}
      </div>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          {menuType !== DEVICE_MENU.MY_BORROW_DEVICE_HISTORY && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
              />
            </Col>
          )}
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
                {menuType === DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY && (
                  <BasicSelect
                    options={BORROW_DEVICE_STATUS}
                    placeholder="Choose status"
                    allowClear
                    onChange={(value) => {
                      setStateQuery((prev: DeviceListQuery) => ({
                        ...prev,
                        isReturned: value,
                      }));
                    }}
                  />
                )}
                {menuType !== DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY && (
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
                )}
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
}
