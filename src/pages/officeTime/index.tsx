import { Card, Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import Loading from 'components/loading';
import TimeComponent from 'components/TimePicker';
import { MESSAGE_RES, TIME_HMS, TIME_HOUR } from 'constants/common';
import { useGetUserRoles } from 'hooks/useEmployee';
import { useGetOfficeTime, useUpdateOfficeTime } from 'hooks/useOfficeTime';
import { EmployeeRoles } from 'models/employee';
import { OfficeTimelModel, ResOfficeTimelModify } from 'models/officeTime';
import { useEffect, useState } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './officeTime.module.less';

export default function OfficeTime() {
  const [officeTimeData, setOfficeTimeData] = useState<OfficeTimelModel>();
  const [isShowEditing, setIsShowEditting] = useState(false);
  const [isRoleHr, setIsRoleHr] = useState(false);
  const { data: officeTime, isLoading } = useGetOfficeTime();
  const { data: getUserRole } = useGetUserRoles();
  useEffect(() => {
    if (getUserRole && getUserRole.data) {
      const {
        metadata: { message },
        data: { items },
      } = getUserRole;
      if (message === MESSAGE_RES.SUCCESS && items.length) {
        const isHr = items.find((el: EmployeeRoles) => el.roleId === 1);
        if (isHr) {
          setIsRoleHr(true);
        }
      }
    }
  }, [getUserRole]);
  const { mutate: updateOfficeTime } = useUpdateOfficeTime({
    onSuccess: (response: ResOfficeTimelModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({
          message: 'Update office successfully',
        });
        setIsShowEditting(false);
      }
    },
    onError: (response: ResOfficeTimelModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({
        message: message,
      });
    },
  });
  const submitHandler = (value: OfficeTimelModel) => {
    value.timeStart = getDateFormat(value.timeStart, TIME_HMS);
    value.timeFinish = getDateFormat(value.timeFinish, TIME_HMS);
    updateOfficeTime(value);
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
          <h2 className={styles.header__title}>Office Time</h2>
        </Row>
        {isLoading && <Loading />}
        {!isLoading && (
          <Row className={styles.content__section}>
            <Col span={10}>
              <Card
                title="Start"
                headStyle={{ fontWeight: 600 }}
                bodyStyle={{ backgroundColor: '#FFEFD6' }}
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
                headStyle={{ fontWeight: 600 }}
                bodyStyle={{ backgroundColor: '#BCEAD5' }}
              >
                {officeTimeData?.timeFinish && (
                  <h1 className={styles.content__text}>
                    {getDateFormat(
                      officeTimeData?.timeFinish,
                      TIME_HOUR,
                      TIME_HMS,
                    )}
                  </h1>
                )}
              </Card>
            </Col>
          </Row>
        )}

        {isRoleHr && (
          <Row className={styles.btn__edit}>
            {!isShowEditing && (
              <BasicButton
                title={'Edit'}
                type="outline"
                onClick={() => setIsShowEditting(true)}
              />
            )}
          </Row>
        )}
        {isShowEditing && (
          <Form onFinish={submitHandler}>
            <Row className={styles.btn__edit}>
              <BasicButton title={'Save'} htmlType="submit" type="outline" />
            </Row>
            <Row className={styles.content__section}>
              <Col span={10}>
                <TimeComponent
                  name="timeStart"
                  rules={[{ required: true, message: 'Start time is requied' }]}
                  allowClear
                  defaultValue={officeTimeData?.timeStart}
                />
              </Col>
              <Col span={10}>
                <TimeComponent
                  name="timeFinish"
                  rules={[
                    { required: true, message: 'Finish time is requied' },
                  ]}
                  allowClear
                  defaultValue={officeTimeData?.timeFinish}
                />
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </div>
  );
}
