import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SelectCustomSearch from 'components/SelectCustomSearch';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME } from 'constants/common';
import { ACTION_TYPE, DEVICE_MENU } from 'constants/enums/common';
import {
  DEVICE_HISTORY_STATUS,
  DEVICE_MANAGEMENT_STATUS,
} from 'constants/fixData';
import { DEVICE } from 'constants/services';
import { DeviceListQuery } from 'models/device';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { getStartEndDateFormat } from 'utils/common';
import styles from './extraHeaderDevice.module.less';

interface IProps {
  setIsShowDetailModal?: Dispatch<SetStateAction<boolean>>;
  setStateQuery: Dispatch<SetStateAction<DeviceListQuery>>;
  modalAction?: MutableRefObject<ACTION_TYPE>;
  menuType: string;
  stateQuery?: DeviceListQuery;
}
export default function ExtraHeaderDevice({
  setIsShowDetailModal,
  setStateQuery,
  menuType,
  modalAction,
  stateQuery,
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
      case DEVICE_MENU.DEVICE_MANAGEMENT: {
        returnObject.titlePage = 'All Device List';
        returnObject.titleBtn = 'Add Device';
        break;
      }
      case DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY: {
        returnObject.titlePage = 'All Employee Device History';
        break;
      }
      case DEVICE_MENU.MY_BORROW_DEVICE_HISTORY: {
        returnObject.titlePage = 'My Device History';
        break;
      }
      case DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST: {
        returnObject.titlePage = 'Device Request List';
        break;
      }
      case DEVICE_MENU.SUBORDINATE: {
        returnObject.titlePage = 'Subordinate Device History';
        break;
      }
    }
    return returnObject;
  };
  const handleChangeCreateDate = (_: any, dateString: string) => {
    const fromDate = getStartEndDateFormat(dateString[0], DATE_TIME);
    const toDate = getStartEndDateFormat(dateString[1], DATE_TIME, false);
    setStateQuery((prev: any) => ({
      ...prev,
      approvalDateFrom: fromDate,
      approvalDateTo: toDate,
    }));
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>{getTitle().titlePage}</div>
        {(menuType === DEVICE_MENU.DEVICE_TYPE ||
          menuType === DEVICE_MENU.DEVICE_MANAGEMENT) && (
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
          {(menuType === DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY ||
            menuType === DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST ||
            menuType === DEVICE_MENU.SUBORDINATE) && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Name, roll number"
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Search"
              />
            </Col>
          )}
          {menuType === DEVICE_MENU.DEVICE_MANAGEMENT && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search ..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Device Code / Name "
              />
            </Col>
          )}
          {menuType === DEVICE_MENU.DEVICE_TYPE && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search ..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Device Type Name"
              />
            </Col>
          )}
          {menuType === DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST && (
            <Col xs={24} sm={14} md={12} lg={8} xl={6} xxl={6}>
              <BasicDateRangePicker
                placeholder={['From', 'To']}
                label={'Approval Date'}
                onChange={handleChangeCreateDate}
                defaultStartDate={stateQuery?.approvalDateFrom}
                defaultEndDate={stateQuery?.approvalDateTo}
                isUseDefaultValue={!!stateQuery?.approvalDateFrom}
                allowClear
                inputReadOnly={false}
              />
            </Col>
          )}
          {menuType !== DEVICE_MENU.DEVICE_TYPE && (
            <>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                <SelectCustomSearch
                  url={`${DEVICE.model.deviceType}-${DEVICE.model.masterData}`}
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
                  label="Device Type"
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
                {(menuType === DEVICE_MENU.ALL_BORROW_DEVICE_HISTORY ||
                  menuType === DEVICE_MENU.MY_BORROW_DEVICE_HISTORY) && (
                  <BasicSelect
                    options={DEVICE_HISTORY_STATUS}
                    placeholder="Choose status"
                    allowClear
                    label="Status"
                    onChange={(value) => {
                      setStateQuery((prev: DeviceListQuery) => ({
                        ...prev,
                        status: value,
                      }));
                    }}
                  />
                )}
                {menuType === DEVICE_MENU.DEVICE_MANAGEMENT && (
                  <BasicSelect
                    options={DEVICE_MANAGEMENT_STATUS}
                    placeholder="Choose status"
                    allowClear
                    label="Status"
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
