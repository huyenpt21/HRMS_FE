import { Col, Divider, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import { YEAR_MONTH_NUM } from 'constants/common';
import moment from 'moment-timezone';
import { useState } from 'react';
import styles from './payrollDetail.module.less';

export default function PayslipDetail() {
  const [payslipForm] = Form.useForm();
  const [isShowPayslip, setIsShowPayslip] = useState(false);
  const submitHandler = (formValue: { secureCode: string }) => {
    if (formValue) setIsShowPayslip(true);
  };
  return (
    <div className={styles.container}>
      <Col
        xs={24}
        sm={20}
        md={20}
        lg={20}
        xl={14}
        xxl={12}
        className={styles.main}
      >
        {!isShowPayslip && (
          <Form
            form={payslipForm}
            layout="vertical"
            requiredMark
            onFinish={submitHandler}
            className={styles.login__payslip}
          >
            <Row className={styles.login__title}>
              <h2>Enter your security code</h2>
            </Row>
            <BasicInput
              name="secureCode"
              type="password"
              rules={[
                { required: true, message: 'Security code is required' },
                {
                  whitespace: true,
                  message: 'Only white spaces are invalid',
                },
                {
                  min: 8,
                  message: 'Expected at least 8 characters',
                },
              ]}
              allowClear
            />
            <Row className={styles.login__btn}>
              <BasicButton title="Submit" type="filled" htmlType="submit" />
            </Row>
          </Form>
        )}
        {isShowPayslip && (
          <>
            <div className={styles.header__section}>
              <div className={styles.header__title}>Payslip</div>
              <Row gutter={32}>
                <Col span={12} className={styles.left__side}>
                  <BasicDatePicker
                    name="date"
                    picker="month"
                    format={YEAR_MONTH_NUM}
                    defaultValue={moment()}
                  />
                </Col>
                <Col span={12} className={styles.text__bold}>
                  <Row gutter={32}>
                    <Col span="12">Full name:</Col>
                    <Col span="12" className={styles.text_right}>
                      Nguyen Van A
                    </Col>
                  </Row>
                  <Row gutter={32}>
                    <Col span="12">Roll number:</Col>
                    <Col span="12" className={styles.text_right}>
                      MS12344
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.content__section}>
              <Row gutter={32}>
                <Col span="12">Total work day:</Col>
                <Col span="12" className={styles.text_right}>
                  23
                </Col>
              </Row>
              <Divider />
              <Row gutter={32}>
                <Col span="12">Actual work day:</Col>
                <Col span="12" className={styles.text_right}>
                  22
                </Col>
              </Row>
              <Divider />
              <h3>Earnings</h3>
              <div className={styles.pl__16}>
                <Row gutter={32}>
                  <Col span="12">Basic salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    10000000
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">Bonus salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    0
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">OT salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    0
                  </Col>
                </Row>
              </div>
              <Divider />
              <h3>Deductions</h3>
              <div className={styles.pl__16}>
                <Row gutter={32} className={styles.ml__12}>
                  <Col span="12">Tax:</Col>
                  <Col span="12" className={styles.text_right}>
                    750000
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">Social Insurance (10.5%):</Col>
                  <Col span="12" className={styles.text_right}>
                    1050000
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">Fine amount:</Col>
                  <Col span="12" className={styles.text_right}>
                    0
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col span="12">Fine amount:</Col>
                  <Col span="12" className={styles.text_right}>
                    0
                  </Col>
                </Row>
              </div>
              <Divider />
              <Row
                gutter={32}
                className={`${styles.text__main} ${styles.net__income}`}
              >
                <Col span={12}>NET Income:</Col>
                <Col span={12} className={styles.text_right}>
                  8200000
                </Col>
              </Row>
            </div>
          </>
        )}
      </Col>
    </div>
  );
}
