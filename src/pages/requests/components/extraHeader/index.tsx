import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME } from 'constants/common';
import { ACTION_TYPE, REQUEST_MENU } from 'constants/enums/common';
import {
  MY_REQUEST_STATUS_LIST,
  REQUEST_STATUS_LIST,
  REQUEST_TYPE_LIST,
} from 'constants/fixData';
import { RequestListQuery } from 'models/request';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { getStartEndDateFormat } from 'utils/common';
import styles from './extraHeaderRequest.module.less';
interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  tabType: string;
  setStateQuery: Dispatch<SetStateAction<RequestListQuery>>;
  stateQuery: RequestListQuery;
}
const ExtraTableHeader = ({
  setIsShowDetailModal,
  modalAction,
  tabType,
  setStateQuery,
  stateQuery,
}: IProps) => {
  const addRequestHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };
  const handleChangeCreateDate = (_: any, dateString: string) => {
    const fromDate = getStartEndDateFormat(dateString[0], DATE_TIME);
    const toDate = getStartEndDateFormat(dateString[1], DATE_TIME, false);
    setStateQuery((prev: any) => ({
      ...prev,
      createDateFrom: fromDate,
      createDateTo: toDate,
    }));
  };

  const handleChangeFilter = (value: number, fieldName: string) => {
    setStateQuery((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const getNamePage = () => {
    switch (tabType) {
      case REQUEST_MENU.MY_REQUEST: {
        return 'My Request List';
      }
      case REQUEST_MENU.SUBORDINATE: {
        return 'Subordinate Request List';
      }
      case REQUEST_MENU.ALL: {
        return 'All Request List';
      }
    }
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>{getNamePage()}</div>
        {tabType === REQUEST_MENU.MY_REQUEST && (
          <BasicButton
            title="Add Request"
            type="filled"
            icon={<PlusOutlined />}
            onClick={addRequestHandler}
          />
        )}
      </div>
      <div className={styles.header__container}>
        <Row gutter={20} className={styles.filter__section}>
          {tabType !== REQUEST_MENU.MY_REQUEST && (
            <Col xs={24} sm={10} md={12} lg={6} xl={4} xxl={4}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Name, roll number"
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Search"
                defaultValue={stateQuery?.search}
              />
            </Col>
          )}
          <Col xs={24} sm={14} md={12} lg={8} xl={6} xxl={6}>
            <BasicDateRangePicker
              placeholder={['From', 'To']}
              label={'Create Date'}
              onChange={handleChangeCreateDate}
              defaultStartDate={stateQuery?.createDateFrom}
              defaultEndDate={stateQuery?.createDateTo}
              isUseDefaultValue={!!stateQuery?.createDateFrom}
              allowClear
              inputReadOnly={false}
            />
          </Col>

          <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={4}>
            <BasicSelect
              options={REQUEST_TYPE_LIST}
              placeholder="Request Type"
              label="Request Type"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={(value) => {
                handleChangeFilter(value, 'requestTypeId');
              }}
              defaultValue={stateQuery?.requestTypeId ?? undefined}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={4} xl={4} xxl={4}>
            <BasicSelect
              options={
                tabType === REQUEST_MENU.MY_REQUEST
                  ? MY_REQUEST_STATUS_LIST
                  : REQUEST_STATUS_LIST
              }
              placeholder="Choose status"
              label="Status"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={(value) => {
                handleChangeFilter(value, 'status');
              }}
              defaultValue={stateQuery?.status ?? undefined}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ExtraTableHeader;
