import { PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicSelect from 'components/BasicSelect';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME } from 'constants/common';
import { ACTION_TYPE, REQUEST_MENU } from 'constants/enums/common';
import { REQUEST_TYPE_LIST } from 'constants/fixData';
import { RequestListQuery } from 'models/request';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './extraHeaderRequest.module.less';
interface IProps {
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  tabType: string;
  setStateQuery: Dispatch<SetStateAction<RequestListQuery>>;
}
const ExtraTableHeader = ({
  setIsShowDetailModal,
  modalAction,
  tabType,
  setStateQuery,
}: IProps) => {
  const addRequestHandler = () => {
    setIsShowDetailModal(true);
    modalAction.current = ACTION_TYPE.CREATE;
  };
  const handleChangeCreateDate = (_: any, dateString: string) => {
    const fromDate = getDateFormat(dateString[0], DATE_TIME);
    const toDate = getDateFormat(dateString[1], DATE_TIME);
    setStateQuery((prev: any) => ({
      ...prev,
      createDateFrom: fromDate,
      createDateTo: toDate,
    }));
  };

  const handleChangeRequestType = (value: number) => {
    setStateQuery((prev: any) => ({
      ...prev,
      requestTypeId: value,
    }));
  };
  return (
    <>
      <div className={styles.header__section}>
        <div className={styles.header__title}>
          {tabType === REQUEST_MENU.MY_REQUEST
            ? 'My Request List'
            : tabType === REQUEST_MENU.SUBORDINATE
            ? 'Subordinate Request List'
            : 'All Request List'}
        </div>
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
            <Col span={6}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Employee Name"
              />
            </Col>
          )}
          <Col span={6}>
            <BasicDateRangePicker
              placeholder={['From', 'To']}
              label="Create Date"
              onChange={handleChangeCreateDate}
            />
          </Col>
          <Col span={4}>
            <BasicSelect
              options={REQUEST_TYPE_LIST}
              placeholder="Request Type"
              label="Request Type"
              allowClear
              showSearch
              optionFilterProp="label"
              onChange={handleChangeRequestType}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ExtraTableHeader;
