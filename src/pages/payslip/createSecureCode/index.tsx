import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import Loading from 'components/loading';
import { MESSAGE_RES } from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useCreateSecurityCode } from 'hooks/usePayslip';
import { ResPayslipModify, SercurityCode } from 'models/payslip';
import { useNavigate } from 'react-router-dom';
import { checkSecureCode } from 'store/slice/auth';
import styles from '../payrollDetail.module.less';
export default function CreateSecurityCode() {
  const [settingForm] = Form.useForm();
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { mutate: createSecureCode, isLoading: loadingCreate } =
    useCreateSecurityCode({
      onSuccess: (response: ResPayslipModify) => {
        const {
          metadata: { message },
          data: isSecureCodeCreate,
        } = response;
        if (message === MESSAGE_RES.SUCCESS && !!isSecureCodeCreate) {
          dispath(checkSecureCode({ isSecureCodeCreated: true }));
          notification.success({
            message: 'Create security code successfully',
          });
          navigate('/emp-self-service/payslip');
        }
      },
      onError: (response: ResPayslipModify) => {
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
  const submitHandler = (value: SercurityCode) => {
    createSecureCode(value);
    settingForm.resetFields();
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
        <Row className={styles.header__title}>
          <div>Create security code</div>
        </Row>
        <Form
          form={settingForm}
          layout="vertical"
          requiredMark
          onFinish={submitHandler}
          className={styles.login__payslip}
        >
          {loadingCreate && <Loading text="Working on it..." />}
          {!loadingCreate && (
            <>
              <BasicInput
                name="newSecureCode"
                label="New security code"
                type="password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your security code!',
                  },
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
                      if (!value || getFieldValue('newSecureCode') === value) {
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
              <Row>
                <BasicButton
                  title="Submit"
                  type="filled"
                  htmlType="submit"
                  className={styles.login__btn}
                />
              </Row>
            </>
          )}
        </Form>
      </Col>
    </div>
  );
}
