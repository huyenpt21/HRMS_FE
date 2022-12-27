import {
  BackwardOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Col, notification, Row, Upload } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker, {
  RangeValue,
} from 'components/BasicDateRangePicker';
import { downloadFile } from 'components/DownloadFile';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { ACCESS_TOKEN, DATE_TIME, US_DATE_FORMAT } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { TIME_CHECK } from 'constants/services';
import { TimeCheckEmployeeInfo, TimeCheckListQuery } from 'models/timeCheck';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  employeeInfor?: TimeCheckEmployeeInfo;
  refetchList: () => {};
}
export default function ExtraTableTimeCheck({
  menuType,
  setStateQuery,
  stateQuery,
  employeeInfor,
  refetchList,
}: IProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dates, setDates] = useState<RangeValue>(null);
  const token = localStorage.getItem(ACCESS_TOKEN) || null;

  const handleChangeDate = (date: any, dateString: string[]) => {
    let startDate: string | undefined;
    let endDate: string | undefined;
    switch (menuType) {
      case MENU_TYPE.MINE:
      case MENU_TYPE.DETAIL: {
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
    const type = location.pathname.split('/')[2];
    if (type === 'subordinate') navigate('/time-check/subordinate');
    if (type === 'all') navigate('/time-check/all');
  };

  const handleTitle = () => {
    let title = '';
    switch (menuType) {
      case MENU_TYPE.MINE: {
        title = 'My Time Check';
        break;
      }
      case MENU_TYPE.ALL: {
        title = 'All Employee Time Check';
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

  const downloadHandler = () => {
    let url = `${TIME_CHECK.model.hr}/${TIME_CHECK.service}/${TIME_CHECK.model.export}`;
    const outputFilename = `timecheck-${getDateFormat(
      moment(),
      DATE_TIME,
    )}.xlsx`;
    delete stateQuery.limit;
    delete stateQuery.page;
    downloadFile(url, outputFilename, stateQuery);
  };
  const handleClickReload = () => {
    refetchList();
  };

  return (
    <>
      <div className={`header__section ${styles.header}`}>
        <div className={styles.header__top}>
          <div className="header__title">{handleTitle()}</div>
          {menuType === MENU_TYPE.DETAIL && (
            <span>
              <BasicButton
                title="Back"
                type="filled"
                icon={<BackwardOutlined />}
                onClick={handleBackButton}
              />
              <BasicButton
                title="Reload"
                type="outline"
                icon={<ReloadOutlined />}
                className={styles.btn}
                onClick={handleClickReload}
              />
            </span>
          )}
          {(menuType === MENU_TYPE.MINE ||
            menuType === MENU_TYPE.SUBORDINATE) && (
            <BasicButton
              title="Reload"
              type="outline"
              icon={<ReloadOutlined />}
              className={styles.btn}
              onClick={handleClickReload}
            />
          )}
          {menuType === MENU_TYPE.ALL && (
            <span>
              <BasicButton
                title="Download"
                type="outline"
                icon={<DownloadOutlined />}
                onClick={downloadHandler}
                className={styles.btn}
              />
              <Upload
                className={styles.btn}
                action={`${process.env.REACT_APP_API_URL}${TIME_CHECK.model.hr}/${TIME_CHECK.service}/${TIME_CHECK.model.import}`}
                headers={{ authorization: 'Bearer ' + token }}
                onChange={(info) => {
                  if (info.file.status === 'done') {
                    if (info.file.response?.data === 'OK') {
                      refetchList();
                      notification.success({
                        message: info.file.response?.metadata?.message,
                      });
                    } else {
                      notification.error({
                        message: info.file.response?.metadata?.message,
                      });
                    }
                  } else {
                    if (info.file.response?.metadata?.message) {
                      notification.error({
                        message: info.file.response?.metadata?.message,
                        key: '1',
                      });
                    }
                  }
                }}
                showUploadList={false}
              >
                <BasicButton
                  title="Upload"
                  type="outline"
                  icon={<UploadOutlined />}
                />
              </Upload>
              <BasicButton
                title="Reload"
                type="outline"
                icon={<ReloadOutlined />}
                className={styles.btn}
                onClick={handleClickReload}
              />
            </span>
          )}
        </div>
        {menuType === MENU_TYPE.DETAIL && (
          <>
            <div>
              <span className={styles.employee__info}>Full Name:</span>
              <span className={styles['text--bold']}>
                {employeeInfor?.personName}
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
        {(menuType === MENU_TYPE.MINE || menuType === MENU_TYPE.DETAIL) && (
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
              inputReadOnly
            />
          </Col>
        )}
        {(menuType === MENU_TYPE.SUBORDINATE || menuType === MENU_TYPE.ALL) && (
          <>
            <Col span={22}>
              <Row gutter={20}>
                <Col xs={24} sm={18} md={8} xl={8} xxl={6}>
                  <InputDebounce
                    suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                    placeholder="Search ..."
                    allowClear
                    setStateQuery={setStateQuery}
                    keyParam="search"
                    label="Roll Number / Name"
                  />
                </Col>
                <Col xs={24} sm={18} md={10} xl={8} xxl={6}>
                  <BasicDatePicker
                    label="Filter date"
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
                    inputReadOnly
                  />
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
