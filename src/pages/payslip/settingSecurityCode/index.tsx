import { Col, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import styles from '../payrollDetail.module.less';
export default function SettingSecurityCode() {
  const [settingForm] = Form.useForm();
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
          // onFinish={submitHandler}
          className={styles.login__payslip}
        >
          <Row className={styles.login__title}>
            <h2>Setting security code</h2>
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
      </Col>
    </div>
  );
}
