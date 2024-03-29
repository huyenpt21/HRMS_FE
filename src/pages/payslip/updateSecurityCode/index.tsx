import { Col, Form, notification, Row, Tooltip } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import Loading from 'components/loading';
import { MESSAGE_RES } from 'constants/common';
import { useAppSelector } from 'hooks';
import {
  useForgotSecureCodeExist,
  useUpdateSecurityCode,
} from 'hooks/usePayslip';
import { ResPayslipModify, SercurityCode } from 'models/payslip';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import dataCheckExistMock from '../dataCheckExistMock.json';
import styles from '../payrollDetail.module.less';

export default function UpdateSecurityCode() {
  const [settingForm] = Form.useForm();
  const navigate = useNavigate();
  const isSecureCodeCreated = useAppSelector(
    (state) => state.auth.isSecureCodeCreated,
  );
  useEffect(() => {
    if (!isSecureCodeCreated) {
      notification.warning({
        message: 'You do not have a security code',
        key: '1',
      });
      navigate('/setting/security-code/create');
    }
  }, [isSecureCodeCreated]);

  const { mutate: updateSecureCode, isLoading: loadingUpdateCode } =
    useUpdateSecurityCode({
      onSuccess: (response: ResPayslipModify) => {
        const {
          metadata: { message },
          data: isSecureCodeCreate,
        } = response;
        if (message === MESSAGE_RES.SUCCESS && !!isSecureCodeCreate) {
          notification.success({
            message: 'Update security code successfully',
          });
        }
      },
      onError: (response: ResPayslipModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
      },
    });
  const { mutate: forgotSecureCode, isLoading: loadingSendEmail } =
    useForgotSecureCodeExist({
      onSuccess: (response: ResPayslipModify) => {
        const {
          metadata: { message },
          data: isSecureCodeCreate,
        } = response;
        if (message === MESSAGE_RES.SUCCESS && !!isSecureCodeCreate) {
          notification.success({
            message: 'Check your email to get new security code',
          });
        }
      },
      onError: (response: ResPayslipModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
      },
    });

  const submitHandler = (value: SercurityCode) => {
    updateSecureCode(value);
    settingForm.resetFields();
  };
  const handleForgotSecureCode = () => {
    forgotSecureCode();
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
          <div>Update security code</div>
        </Row>
        <Form
          form={settingForm}
          layout="vertical"
          requiredMark
          onFinish={submitHandler}
          className={styles.login__payslip}
        >
          {(loadingSendEmail || loadingUpdateCode) && (
            <Loading text="Working on it..." />
          )}
          {!loadingSendEmail && !loadingUpdateCode && (
            <>
              <BasicInput
                name="currentSecureCode"
                label="Your old security code"
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
              />
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
                <Col span={24}>
                  <Tooltip
                    title="Send new security code to your email"
                    placement="topRight"
                  >
                    <p
                      className={styles.forgot__text}
                      onClick={handleForgotSecureCode}
                    >
                      Forgot your security code?
                    </p>
                  </Tooltip>
                </Col>
              </Row>
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
