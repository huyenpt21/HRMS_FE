import { BackwardOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME, US_DATE_FORMAT } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { TimeCheckListQuery } from 'models/timeCheck';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDateFormat,
  getEndOfWeek,
  getStartEndDateFormat,
  getStartOfWeek,
} from 'utils/common';
import BasicDatePicker from '../../../../components/BasicDatePicker';
import styles from './extraHeaderTimeCheck.module.less';

interface IProps {
  menuType: MENU_TYPE;
  setStateQuery: Dispatch<SetStateAction<TimeCheckListQuery>>;
  stateQuery: TimeCheckListQuery;
  employeeInfor?: any;
}
export default function ExtraTableTimeCheck({
  menuType,
  setStateQuery,
  stateQuery,
  employeeInfor,
}: IProps) {
  const navigate = useNavigate();

  const handleChangeDate = (date: any, dateString: string[]) => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    switch (menuType) {
      case MENU_TYPE.MIME: {
        startDate = getStartEndDateFormat(dateString[0], DATE_TIME);
        endDate = getStartEndDateFormat(dateString[1], DATE_TIME);
        break;
      }
      case MENU_TYPE.ALL:
      case MENU_TYPE.SUBORDINATE: {
        startDate = getStartOfWeek(date, DATE_TIME).toString();
        endDate = getEndOfWeek(date, DATE_TIME).toString();
      }
    }
    setStateQuery((prev: any) => ({
      ...prev,
      startDate: startDate,
      endDate: endDate,
    }));
  };
  const extraFooter = () => {
    return (
      <div className={styles['current--week']} onClick={handleClickToday}>
        Current Week
      </div>
    );
  };
  const handleClickToday = () => {
    const startDate = getStartOfWeek(moment(), DATE_TIME).toString();
    const endDate = getEndOfWeek(moment(), DATE_TIME).toString();
    setStateQuery((prev: any) => ({
      ...prev,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const handleBackButton = () => {
    navigate('/time-check/all');
  };

  return (
    <>
      <div className={`header__section ${styles.header}`}>
        <div className={styles.header__top}>
          <div className="header__title">
            {menuType === MENU_TYPE.MIME
              ? 'My Time Check'
              : menuType === MENU_TYPE.ALL
              ? 'All Time Check'
              : 'Subordinate Time Check'}
          </div>
          {menuType === MENU_TYPE.DETAIL && (
            <BasicButton
              title="Back"
              type="filled"
              icon={<BackwardOutlined />}
              onClick={handleBackButton}
            />
          )}
        </div>
        {menuType === MENU_TYPE.DETAIL && (
          <>
            <div>
              <span>Full Name:</span>
              <span className={styles['text--bold']}>
                {employeeInfor?.name}
              </span>
            </div>
            <div>
              <span>Roll Number:</span>
              <span className={styles['text--bold']}>
                {employeeInfor?.rollNumber}
              </span>
            </div>
          </>
        )}
      </div>
      <Row gutter={20}>
        {(menuType === MENU_TYPE.MIME || menuType === MENU_TYPE.DETAIL) && (
          <Col span={6}>
            <BasicDateRangePicker
              label="Filter date"
              onChange={handleChangeDate}
              placeholder={['From', 'To']}
              defaultStartDate={stateQuery.startDate}
              defaultEndDate={stateQuery.endDate}
              isUseDefaultValue={!!stateQuery.startDate}
            />
          </Col>
        )}
        {(menuType === MENU_TYPE.SUBORDINATE || menuType === MENU_TYPE.ALL) && (
          <>
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
            <Col span={5}>
              <BasicDatePicker
                label="Date"
                picker="week"
                format={`${getDateFormat(
                  stateQuery.startDate,
                  US_DATE_FORMAT,
                )} - ${getDateFormat(stateQuery.endDate, US_DATE_FORMAT)}`}
                defaultValue={moment(stateQuery.startDate)}
                allowClear={false}
                onChange={handleChangeDate}
                renderExtraFooter={extraFooter}
                value={moment(stateQuery.startDate)}
              />
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
