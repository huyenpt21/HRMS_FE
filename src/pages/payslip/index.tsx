import { Col, Divider, Form, notification, Row, Tooltip } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import { MESSAGE_RES, YEAR_MONTH_NUM } from 'constants/common';
import {
  useCheckSecureCodeCorrectly,
  useCheckSecureCodeExist,
  useGetPayslip,
  useSendPayslipToEmail,
} from 'hooks/usePayslip';
import {
  PayslipFilter,
  PayslipModel,
  ResPayslipDetail,
  ResPayslipModify,
  SercurityCode,
} from 'models/payslip';
import moment from 'moment-timezone';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './payrollDetail.module.less';
import { SendOutlined } from '@ant-design/icons';
import { SHAPE_TYPE } from 'constants/enums/common';
import NotifyPopup from 'components/NotifyPopup';
// import dataCheckExistMock from './dataCheckExistMock.json';
// import dataCheckCorrectMock from './dataCheckCorrect.json';

export default function PayslipDetail() {
  const [payslipForm] = Form.useForm();
  const navigate = useNavigate();
  const [isShowPayslip, setIsShowPayslip] = useState(false);
  const [isShowPopConfirm, setIsShowPopConfirm] = useState(false);
  const payslipDataRef = useRef<PayslipModel>();
  const dateFilterRef = useRef<PayslipFilter>({
    month: Number(moment().get('month')),
    year: Number(moment().get('year')),
  });
  const { data: secureCodeData } = useCheckSecureCodeExist();

  useEffect(() => {
    if (secureCodeData) {
      const { data: isSecureCodeExist } = secureCodeData;
      if (!isSecureCodeExist) {
        setIsShowPopConfirm(true);
      }
    }
  }, [secureCodeData]);
  const { mutate: sendPayslipToEmail } = useSendPayslipToEmail({
    onSuccess: (response: ResPayslipModify) => {
      const {
        metadata: { message },
        data: isSent,
      } = response;
      if (message === MESSAGE_RES.SUCCESS && !!isSent) {
        notification.success({ message: 'Sent payslip to email successfully' });
      }
    },
    onError: (response: ResPayslipModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });
  const { mutate: checkSecureCodeCorrect } = useCheckSecureCodeCorrectly({
    onSuccess: (response: ResPayslipModify) => {
      const {
        metadata: { message },
        data: isSecureCodeCorrect,
      } = response;
      if (message === MESSAGE_RES.SUCCESS && !!isSecureCodeCorrect) {
        setIsShowPayslip(true);
      } else {
        notification.error({ message: 'Incorrect security code' });
      }
    },
    onError: (response: ResPayslipModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });
  useEffect(() => {
    if (isShowPayslip) {
      payslipData({
        month: Number(moment().get('month')),
        year: Number(moment().get('year')),
      });
    }
  }, [isShowPayslip]);
  const { mutate: payslipData } = useGetPayslip({
    onSuccess: (response: ResPayslipDetail) => {
      const {
        metadata: { message },
        data: { payrollDisplayDto },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        payslipDataRef.current = payrollDisplayDto;
      }
    },
    onError: (response: ResPayslipDetail) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });

  const submitHandler = (formValue: SercurityCode) => {
    checkSecureCodeCorrect(formValue);
  };
  const handleChangeFilterDate = (_: moment.Moment, dateString: string) => {
    const month = Number(dateString.split('/')[0].trim());
    const year = Number(dateString.split('/')[1].trim());
    dateFilterRef.current = {
      month: month,
      year: year,
    };
    payslipData({ month: month, year: year });
  };
  return (
    <div className={styles.container}>
      <Col
        xs={24}
        sm={20}
        md={20}
        lg={20}
        xl={16}
        xxl={12}
        className={styles.main}
      >
        {!isShowPayslip && (
          <>
            <Row className={styles.header__title}>
              <div>Enter your security code</div>
            </Row>
            <Form
              form={payslipForm}
              layout="vertical"
              requiredMark
              onFinish={submitHandler}
              className={styles.login__payslip}
            >
              <BasicInput
                name="currentSecureCode"
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
              <BasicButton
                title="Submit"
                type="filled"
                htmlType="submit"
                className={styles.login__btn}
              />
            </Form>
          </>
        )}
        {isShowPayslip && (
          <>
            <div className={styles.header__section}>
              <div className={styles.header__title}>Payslip</div>
              <Row gutter={32} className={styles.header__content}>
                <Col
                  sm={10}
                  md={10}
                  xl={8}
                  xxl={8}
                  className={styles.left__side}
                >
                  <BasicDatePicker
                    name="date"
                    picker="month"
                    format={YEAR_MONTH_NUM}
                    defaultValue={moment().subtract(1, 'month')}
                    onChange={handleChangeFilterDate}
                    disabledDate={(current) =>
                      current >= moment().startOf('month')
                    }
                  />
                </Col>
                <Col className={styles.text__bold}>
                  <Row>Full name: {payslipDataRef.current?.personName}</Row>
                  <Row>Roll number: {payslipDataRef.current?.rollNumber}</Row>
                </Col>
              </Row>
            </div>
            <Divider />
            <div className={styles.content__section}>
              <Row gutter={32}>
                <Col span="12">Total work day:</Col>
                <Col span="12" className={styles.text_right}>
                  {payslipDataRef.current?.totalWork}
                </Col>
              </Row>
              <Divider />
              <Row gutter={32}>
                <Col span="12">Actual work day:</Col>
                <Col span="12" className={styles.text_right}>
                  {payslipDataRef.current?.actualWork}
                </Col>
              </Row>
              <Divider />
              <h3>Earnings</h3>
              <div className={styles.pl__16}>
                <Row gutter={32}>
                  <Col span="12">Basic salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    {payslipDataRef.current?.basicSalary}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">Bonus salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    {payslipDataRef.current?.salaryBonus}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">OT salary:</Col>
                  <Col span="12" className={styles.text_right}>
                    {payslipDataRef.current?.otSalary}
                  </Col>
                </Row>
              </div>
              <Divider />
              <h3>Deductions</h3>
              <div className={styles.pl__16}>
                <Row gutter={32} className={styles.ml__12}>
                  <Col span="12">Tax:</Col>
                  <Col span="12" className={styles.text_right}>
                    {payslipDataRef.current?.tax}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={32}>
                  <Col span="12">Social Insurance (10.5%):</Col>
                  <Col span="12" className={styles.text_right}>
                    {payslipDataRef.current?.socialInsurance}
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
                  {payslipDataRef.current?.actuallyReceived}
                </Col>
              </Row>
              <Row gutter={32} className={styles.send__email}>
                <Tooltip title="Send to email">
                  <span>
                    <BasicButton
                      type="outline"
                      shape={SHAPE_TYPE.ROUND}
                      icon={<SendOutlined />}
                      onClick={() => {
                        sendPayslipToEmail(dateFilterRef.current);
                      }}
                    />
                  </span>
                </Tooltip>
              </Row>
            </div>
          </>
        )}
      </Col>
      {!isShowPopConfirm && (
        <NotifyPopup
          title="You do not have a security code"
          message="Go to setting?"
          onCancel={() => {
            setIsShowPopConfirm(false);
          }}
          onConfirm={() => {
            navigate('/setting/security-code/create');
          }}
          status="warning"
          visible={isShowPopConfirm}
        />
      )}
    </div>
  );
}
