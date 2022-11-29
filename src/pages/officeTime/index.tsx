import { Card, Col, Row } from 'antd';
import { TIME_HOUR } from 'constants/common';
import { useGetOfficeTime } from 'hooks/useOfficeTime';
import { OfficeTimelModel } from 'models/officeTime';
import { useEffect, useRef } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './officeTime.module.less';

export default function OfficeTime() {
  const officeTimeData = useRef<OfficeTimelModel>();
  const { data: officeTime } = useGetOfficeTime();
  useEffect(() => {
    if (officeTime && officeTime?.data) {
      const {
        data: { item },
      } = officeTime;
      officeTimeData.current = item;
    }
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Row className={styles.header__section}>
          <h2 className={styles.header__title}>Office Time</h2>
        </Row>
        <Row className={styles.content__section}>
          <Col span={10}>
            <Card
              title="Start"
              headStyle={{ fontWeight: 600 }}
              bodyStyle={{ backgroundColor: '#FFEFD6' }}
            >
              <h1 className={styles.content__text}>
                {getDateFormat(
                  officeTimeData.current?.timeStart,
                  TIME_HOUR,
                  TIME_HOUR,
                )}
              </h1>
            </Card>
          </Col>
          <Col span={10}>
            <Card
              title="Finish"
              headStyle={{ fontWeight: 600 }}
              bodyStyle={{ backgroundColor: '#BCEAD5' }}
            >
              <h1 className={styles.content__text}>
                {getDateFormat(
                  officeTimeData.current?.timeFinish,
                  TIME_HOUR,
                  TIME_HOUR,
                )}
              </h1>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
