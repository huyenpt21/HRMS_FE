import { Card, Col, Divider, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import Loading from 'components/loading';
import TimeComponent from 'components/TimePicker';
import { MESSAGE_RES, TIME_HMS, TIME_HOUR } from 'constants/common';
import { useAppSelector } from 'hooks';
import {
  useGetOfficeTime,
  useUpdateLunchBreakOfficeTime,
  useUpdateOfficeTime,
} from 'hooks/useOfficeTime';
import { OfficeTimelModel, ResOfficeTimelModify } from 'models/officeTime';
import { useEffect, useState } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './officeTime.module.less';

export default function OfficeTime() {
  const userRoles = useAppSelector((state) => state.auth.roles);
  const [officeTimeData, setOfficeTimeData] = useState<OfficeTimelModel>();
  const [isShowEditing, setIsShowEditting] = useState(false);
  const [isShowLunchBreakEditing, setIsShowLunchBreakEditting] =
    useState(false);
  const [isRoleHr, setIsRoleHr] = useState(false);
  const { data: officeTime, isLoading } = useGetOfficeTime();
  useEffect(() => {
    if (userRoles) {
      const isHr = userRoles.find((el: number) => el === 1);
      if (isHr) {
        setIsRoleHr(true);
      }
    }
  }, [userRoles]);
  const { mutate: updateOfficeTime, isLoading: loadingUpdate } =
    useUpdateOfficeTime({
      onSuccess: (response: ResOfficeTimelModify) => {
        const {
          metadata: { message },
        } = response;

        if (message === MESSAGE_RES.SUCCESS) {
          notification.success({
            message: 'Update office time successfully',
          });
          setIsShowEditting(false);
        }
      },
      onError: (response: ResOfficeTimelModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({
            message: message,
          });
        }
      },
    });
  const {
    mutate: updateLunchBreakOfficeTime,
    isLoading: loadingUpdateLunchBreakTime,
  } = useUpdateLunchBreakOfficeTime({
    onSuccess: (response: ResOfficeTimelModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({
          message: 'Update office time successfully',
        });
        setIsShowEditting(false);
      }
    },
    onError: (response: ResOfficeTimelModify) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        notification.error({
          message: message,
        });
      }
    },
  });
  const submitHandler = (value: OfficeTimelModel) => {
    value.timeStart = getDateFormat(value.timeStart, TIME_HMS);
    value.timeFinish = getDateFormat(value.timeFinish, TIME_HMS);
    updateOfficeTime(value);
  };
  const submitLunchBreakHandler = (value: OfficeTimelModel) => {
    value.timeStart = getDateFormat(value.lunchBreakStartTime, TIME_HMS);
    value.timeFinish = getDateFormat(value.lunchBreakEndTime, TIME_HMS);
    delete value.lunchBreakStartTime;
    delete value.lunchBreakEndTime;
    updateLunchBreakOfficeTime(value);
  };
  useEffect(() => {
    if (officeTime && officeTime?.data) {
      const {
        data: { item },
      } = officeTime;
      setOfficeTimeData(item);
    }
  }, [officeTime]);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Row className={styles.header__section}>
          <div className={styles.header__title}>Office Time</div>
        </Row>
        {(isLoading || loadingUpdate || loadingUpdateLunchBreakTime) && (
          <Loading text="Working on it..." />
        )}
        {!isLoading && !loadingUpdate && !loadingUpdateLunchBreakTime && (
          <>
            <Row className={styles.content__section}>
              <Col span={10}>
                <Card
                  title="Start"
                  headStyle={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.8)' }}
                  bodyStyle={{
                    backgroundColor: '#FFEFD6',
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {officeTimeData?.timeStart && (
                    <div className={styles.content__text}>
                      {getDateFormat(
                        officeTimeData?.timeStart,
                        TIME_HOUR,
                        TIME_HMS,
                      )}
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={10}>
                <Card
                  title="Finish"
                  headStyle={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.8)' }}
                  bodyStyle={{
                    backgroundColor: '#BCEAD5',
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {officeTimeData?.timeFinish && (
                    <div className={styles.content__text}>
                      {getDateFormat(
                        officeTimeData?.timeFinish,
                        TIME_HOUR,
                        TIME_HMS,
                      )}
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
            {isRoleHr && !isShowEditing && (
              <Row className={styles.btn__edit}>
                <BasicButton
                  title={'Edit'}
                  type="outline"
                  onClick={() => setIsShowEditting(true)}
                />
              </Row>
            )}
            {isShowEditing && (
              <Form onFinish={submitHandler}>
                <Row className={styles.btn__edit}>
                  <BasicButton
                    title={'Save'}
                    htmlType="submit"
                    type="outline"
                    className={styles.btn__save}
                  />
                  <BasicButton
                    title="Close"
                    type="outline"
                    onClick={() => setIsShowEditting(false)}
                  />
                </Row>
                <Row className={styles.content__section} gutter={32}>
                  <Col span={12}>
                    <TimeComponent
                      name="timeStart"
                      rules={[
                        { required: true, message: 'Start time is requied' },
                      ]}
                      allowClear
                      defaultValue={officeTimeData?.timeStart}
                      classNameFormItem={styles.form_time}
                    />
                  </Col>
                  <Col span={12}>
                    <TimeComponent
                      name="timeFinish"
                      rules={[
                        { required: true, message: 'Finish time is requied' },
                      ]}
                      allowClear
                      defaultValue={officeTimeData?.timeFinish}
                      classNameFormItem={styles.form_time}
                    />
                  </Col>
                </Row>
              </Form>
            )}
            <Divider />
            <Row className={styles.header__section}>
              <div className={styles.header__title}>Lunch Break Time</div>
            </Row>
            <Row className={styles.content__section}>
              <Col span={10}>
                <Card
                  title="Start"
                  headStyle={{
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                  bodyStyle={{
                    backgroundColor: '#FFEFD6',
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {officeTimeData?.lunchBreakStartTime && (
                    <div className={styles.content__text}>
                      {getDateFormat(
                        officeTimeData?.lunchBreakStartTime,
                        TIME_HOUR,
                        TIME_HMS,
                      )}
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={10}>
                <Card
                  title="Finish"
                  headStyle={{
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                  bodyStyle={{
                    backgroundColor: '#BCEAD5',
                    color: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {officeTimeData?.lunchBreakEndTime && (
                    <div className={styles.content__text}>
                      {getDateFormat(
                        officeTimeData?.lunchBreakEndTime,
                        TIME_HOUR,
                        TIME_HMS,
                      )}
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
            {isRoleHr && !isShowLunchBreakEditing && (
              <Row className={styles.btn__edit}>
                <BasicButton
                  title={'Edit'}
                  type="outline"
                  onClick={() => setIsShowLunchBreakEditting(true)}
                />
              </Row>
            )}
            {isShowLunchBreakEditing && (
              <Form onFinish={submitLunchBreakHandler}>
                <Row className={styles.btn__edit}>
                  <BasicButton
                    title="Save"
                    type="outline"
                    htmlType="submit"
                    className={styles.btn__save}
                  />
                  <BasicButton
                    title="Close"
                    type="outline"
                    onClick={() => setIsShowLunchBreakEditting(false)}
                  />
                </Row>
                <Row className={styles.content__section}>
                  <Col span={10}>
                    <TimeComponent
                      name="lunchBreakStartTime"
                      rules={[
                        {
                          required: true,
                          message: 'Start time is requied',
                        },
                      ]}
                      allowClear
                      defaultValue={officeTimeData?.lunchBreakStartTime}
                      classNameFormItem={styles.form_time}
                    />
                  </Col>
                  <Col span={10}>
                    <TimeComponent
                      name="lunchBreakEndTime"
                      rules={[
                        {
                          required: true,
                          message: 'Finish time is requied',
                        },
                      ]}
                      allowClear
                      defaultValue={officeTimeData?.lunchBreakEndTime}
                      classNameFormItem={styles.form_time}
                    />
                  </Col>
                </Row>
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
