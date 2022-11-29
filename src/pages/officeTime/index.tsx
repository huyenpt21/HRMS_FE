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
        <Row className={styles.content__section} gutter={36}>
          <Col span={12}>
            <Card></Card>
          </Col>
          <Col span={12}>
            <Card> </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
