import { SendOutlined } from '@ant-design/icons';
import { Col, Divider, Empty, Form, notification, Row, Tooltip } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import Loading from 'components/loading';
import NotifyPopup from 'components/NotifyPopup';
import { MESSAGE_RES, YEAR_MONTH_NUM } from 'constants/common';
import { SHAPE_TYPE } from 'constants/enums/common';
import { useAppSelector } from 'hooks';
import { useGetPayslip, useSendPayslipToEmail } from 'hooks/usePayslip';
import {
  PayslipFilter,
  PayslipModel,
  ResPayslipDetail,
  ResPayslipModify,
  SercurityCode,
} from 'models/payslip';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './payrollDetail.module.less';
// import dataCheckExistMock from './dataCheckExistMock.json';
// import dataCheckCorrectMock from './dataCheckCorrect.json';

export default function PayslipDetail() {
  const [payslipForm] = Form.useForm();
  const navigate = useNavigate();
  const isSecureCodeCreated = useAppSelector(
    (state) => state.auth.isSecureCodeCreated,
  );
  const [isShowPayslip, setIsShowPayslip] = useState(false);
  const [isShowPopConfirm, setIsShowPopConfirm] = useState(false);
  const payslipDataRef = useRef<PayslipModel>();
  const payslipFilterRef = useRef<PayslipFilter>({
    month: Number(moment().subtract(1, 'month')),
    year: Number(moment().get('year')),
  });
  const dateFilterRef = useRef<moment.Moment>(moment().subtract(1, 'month'));
  useEffect(() => {
    if (!isSecureCodeCreated) {
      setIsShowPopConfirm(true);
    }
  }, [isSecureCodeCreated]);
  const { mutate: sendPayslipToEmail, isLoading: loadingSendToEmail } =
    useSendPayslipToEmail({
      onSuccess: (response: ResPayslipModify) => {
        const {
          metadata: { message },
          data: isSent,
        } = response;
        if (message === MESSAGE_RES.SUCCESS && !!isSent) {
          notification.success({
            message: 'Sent payslip to email successfully',
          });
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
  const { mutate: payslipData, isLoading: loadingGetPayslip } = useGetPayslip({
    onSuccess: (response: ResPayslipDetail) => {
      const {
        metadata: { message },
        data: { payrollDisplayDto },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        payslipDataRef.current = payrollDisplayDto;
        setIsShowPayslip(true);
      }
    },
    onError: (response: ResPayslipDetail) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        payslipDataRef.current = undefined;
        notification.error({
          message: message,
        });
      }
    },
  });

  const submitHandler = (formValue: SercurityCode) => {
    const month = Number(moment().get('month'));
    const year = Number(moment().get('year'));
    payslipFilterRef.current = {
      currentSecureCode: formValue?.currentSecureCode,
      month: month,
      year: year,
    };
    payslipData({
      currentSecureCode: formValue?.currentSecureCode,
      month: month,
      year: year,
    });
  };
  const handleChangeFilterDate = (value: moment.Moment, dateString: string) => {
    dateFilterRef.current = value;
    const month = Number(dateString.split('/')[0].trim());
    const year = Number(dateString.split('/')[1].trim());
    payslipFilterRef.current = {
      ...payslipFilterRef.current,
      month: month,
      year: year,
    };
    payslipData({ ...payslipFilterRef.current, month: month, year: year });
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
            {loadingGetPayslip && <Loading text="Working on it..." />}
            {!loadingGetPayslip && (
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
          </>
        )}
        {isShowPayslip && (
          <>
            {(loadingGetPayslip || loadingSendToEmail) && (
              <Loading text="Working on it..." />
            )}
            {!loadingGetPayslip && !loadingSendToEmail && (
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
                        defaultValue={dateFilterRef.current}
                        onChange={handleChangeFilterDate}
                        disabledDate={(current) =>
                          current >= moment().startOf('month')
                        }
                        inputReadOnly
                      />
                    </Col>
                    <Col className={styles.text__bold}>
                      <Row>Full name: {payslipDataRef.current?.personName}</Row>
                      <Row>
                        Roll number: {payslipDataRef.current?.rollNumber}
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div className={styles.content__section}>
                  {!!payslipDataRef.current && (
                    <>
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
                                sendPayslipToEmail(payslipFilterRef.current);
                              }}
                            />
                          </span>
                        </Tooltip>
                      </Row>
                    </>
                  )}
                  {!payslipDataRef.current && <Empty />}
                </div>
              </>
            )}
          </>
        )}
      </Col>
      {isShowPopConfirm && (
        <NotifyPopup
          title="You do not have a security code"
          message="Go to setting?"
          onCancel={() => {
            setIsShowPopConfirm(false);
          }}
          onConfirm={() => {
            navigate('/setting/security-code/create');
          }}
          visible={isShowPopConfirm}
        />
      )}
    </div>
  );
}
