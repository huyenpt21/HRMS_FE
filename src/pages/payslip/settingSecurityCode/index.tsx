import { Col, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import { SercurityCode } from 'models/payroll';
import styles from '../payrollDetail.module.less';
export default function SettingSecurityCode() {
  const [settingForm] = Form.useForm();
  const submitHandler = (value: SercurityCode) => {};
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
        <Form
          form={settingForm}
          layout="vertical"
          requiredMark
          onFinish={submitHandler}
          className={styles.login__payslip}
        >
          <Row className={styles.login__title}>
            <h2>Setting security code</h2>
          </Row>
          <BasicInput
            name="secureCode"
            label="New security code"
            type="password"
            rules={[
              { required: true, message: 'Please enter your security code!' },
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
            hasFeedback
          />
          <BasicInput
            name="confirmSecureCode"
            label="Confirm security code"
            type="password"
            rules={[
              {
                required: true,
                message: 'Please confirm your security code!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('secureCode') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two security codes that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
            allowClear
            hasFeedback
          />
          <Row className={styles.login__btn}>
            <BasicButton title="Submit" type="filled" htmlType="submit" />
          </Row>
        </Form>
      </Col>
    </div>
  );
}
