import { BackwardOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker, {
  RangeValue,
} from 'components/BasicDateRangePicker';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME, US_DATE_FORMAT } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { TimeCheckListQuery } from 'models/timeCheck';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction, useState } from 'react';
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
  const [dates, setDates] = useState<RangeValue>(null);

  const handleChangeDate = (date: any, dateString: string[]) => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    switch (menuType) {
      case MENU_TYPE.MIME: {
        startDate = getStartEndDateFormat(dateString[0], DATE_TIME);
        endDate = getStartEndDateFormat(dateString[1], DATE_TIME, false);
        break;
      }
      case MENU_TYPE.ALL:
      case MENU_TYPE.SUBORDINATE: {
        startDate = getStartOfWeek(date, DATE_TIME).toString();
        endDate = getEndOfWeek(date, DATE_TIME).toString();
      }
    }
    if (!!date) {
      setStateQuery((prev: any) => ({
        ...prev,
        startDate: startDate,
        endDate: endDate,
      }));
    }
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

  const handleTitle = () => {
    let title = '';
    switch (menuType) {
      case MENU_TYPE.MIME: {
        title = 'My Time Check';
        break;
      }
      case MENU_TYPE.ALL: {
        title = 'All Time Check';
        break;
      }
      case MENU_TYPE.SUBORDINATE: {
        title = 'Subordinate Time Check';
        break;
      }
      case MENU_TYPE.DETAIL: {
        title = 'Detail Time Check';
      }
    }
    return title;
  };

  const disableDate = (current: moment.Moment) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30;
    return !!tooLate || !!tooEarly;
  };

  return (
    <>
      <div className={`header__section ${styles.header}`}>
        <div className={styles.header__top}>
          <div className="header__title">{handleTitle()}</div>
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
              <span className={styles.employee__info}>Full Name:</span>
              <span className={styles['text--bold']}>
                {employeeInfor?.name}
              </span>
            </div>
            <div>
              <span className={styles.employee__info}>Roll Number:</span>
              <span className={styles['text--bold']}>
                {employeeInfor?.rollNumber}
              </span>
            </div>
          </>
        )}
      </div>
      <Row gutter={20}>
        {(menuType === MENU_TYPE.MIME || menuType === MENU_TYPE.DETAIL) && (
          <Col xs={24} sm={20} md={10} xl={8} xxl={6}>
            <BasicDateRangePicker
              label="Filter date"
              onChange={handleChangeDate}
              placeholder={['From', 'To']}
              defaultStartDate={stateQuery.startDate}
              defaultEndDate={stateQuery.endDate}
              isUseDefaultValue={!!stateQuery.startDate}
              onCalendarChange={(values: RangeValue) => setDates(values)}
              disabledDate={disableDate}
              allowClear
            />
          </Col>
        )}
        {(menuType === MENU_TYPE.SUBORDINATE || menuType === MENU_TYPE.ALL) && (
          <>
            <Col xs={24} sm={18} md={8} xl={8} xxl={6}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Employee Name"
              />
            </Col>
            <Col xs={24} sm={18} md={10} xl={8} xxl={6}>
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
