import { Card, Col, Row } from 'antd';
import React from 'react';
import styles from './officeTime.module.less';

export default function OfficeTime() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Row className={styles.header__section}>
          <h2 className={styles.header__title}>Office Time</h2>
        </Row>
        <Row className={styles.content__section}>
          <Col span={10}>
            <Card title="Time In" bodyStyle={{ backgroundColor: '#FFEFD6' }}>
              <h1 className={styles.content__text}>08 : 00</h1>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Time Out" bodyStyle={{ backgroundColor: '#BCEAD5' }}>
              <h1 className={styles.content__text}>18 : 00</h1>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
