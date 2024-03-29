import { BackwardOutlined } from '@ant-design/icons';
import { Col, Divider, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import Loading from 'components/loading';
import MultipleImagePreview from 'components/MultipleImagePreview';
import TimeRangePicker from 'components/TimeRangePicker';
import { DATE_TIME_US, MESSAGE_RES } from 'constants/common';
import { REQUEST_TYPE_KEY, STATUS } from 'constants/enums/common';
import { REQUEST_MATERNITY_OPTION, REQUEST_TYPE_LIST } from 'constants/fixData';
import { useChangeStatusRequest, useRequestDetail } from 'hooks/useRequestList';
import { RequestModel, ResRequestModify } from 'models/request';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FixDataHeaderRequest from '../components/fixDataHeaderRequest';
// import dataMock from './detailMock.json';
import styles from './detailPageRequestNoti.module.less';

export default function DetailPageRequestForNoti() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const menuType = location.pathname.split('/')[1];
  const [requestForm] = Form.useForm();
  const [requestData, setRequestData] = useState<RequestModel>();
  const [evidenceSource, setEvidenceSource] = useState<string[]>([]);

  const {
    data: detailRequest,
    isLoading: loadingDetail,
    refetch,
  } = useRequestDetail(requestId || -1);
  const { mutate: statusRequest, isLoading: loadingChangeStatus } =
    useChangeStatusRequest({
      onSuccess: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        if (message === 'Success') {
          notification.success({
            message: 'Responding request successfully',
          });
        }
      },
      onError: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
      },
    });
  useEffect(() => {
    if (detailRequest && detailRequest?.data) {
      const {
        metadata: { message },
        data: { item },
      } = detailRequest;
      if (message === MESSAGE_RES.SUCCESS && item) {
        setRequestData(item);
        requestForm.setFieldsValue(item);
        if (
          item?.requestTypeName === REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT ||
          item.requestTypeName === REQUEST_TYPE_KEY.MATERNITY
        ) {
          requestForm.setFieldsValue({
            date: moment(item.startTime),
            time: [moment(item.startTime), moment(item.endTime)],
          });
        } else {
          requestForm.setFieldsValue({
            date: [moment(item.startTime), moment(item.endTime)],
            time: [moment(item.startTime), moment(item.endTime)],
          });
        }
        if (
          item?.requestTypeName === REQUEST_TYPE_KEY.LEAVE ||
          item?.requestTypeName === REQUEST_TYPE_KEY.LEAVE
        ) {
          requestForm.setFieldsValue({
            timeRemaining: item?.timeRemaining?.toFixed(2),
            otTimeRemainingOfMonth: item?.otTimeRemainingOfMonth?.toFixed(2),
            otTimeRemainingOfYear: item?.otTimeRemainingOfYear?.toFixed(2),
          });
        }
        if (item?.listEvidence) {
          setEvidenceSource(item?.listEvidence);
        }
      }
    }
  }, [detailRequest]);
  const handleQickActionRequest = (statusValue: string) => {
    requestId &&
      statusRequest({
        uid: requestId,
        body: { status: statusValue },
      });
    refetch();
  };
  const handleBackButton = () => {
    if (menuType === 'request-center') {
      navigate('/request-center/subordinate');
    }
    if (menuType === 'emp-self-service') {
      navigate('/emp-self-service/request');
    }
  };
  return (
    <Row className={styles.container}>
      <Col
        xs={24}
        sm={20}
        md={20}
        lg={20}
        xl={20}
        xxl={16}
        className={styles.content}
      >
        <Row className={styles.header}>
          <div className={styles.header__title}>Request detail</div>
          <BasicButton
            title="Back"
            type="filled"
            icon={<BackwardOutlined />}
            onClick={handleBackButton}
          />
        </Row>
        <Divider />
        {(loadingDetail || loadingChangeStatus) && (
          <Loading text="Working on it..." />
        )}
        {!loadingDetail && !loadingChangeStatus && (
          <Form
            form={requestForm}
            layout="vertical"
            requiredMark
            disabled={true}
          >
            <Row gutter={20}>
              <Col span={24} className={styles.notice}>
                {requestData?.timeRemaining === 0 &&
                  requestData?.requestTypeName === REQUEST_TYPE_KEY.LEAVE && (
                    <div>
                      * Notice: This person have used up all the holidays this
                      year
                    </div>
                  )}
                {requestData?.requestTypeName === REQUEST_TYPE_KEY.OT && (
                  <>
                    {requestData?.otTimeRemainingOfYear === 0 && (
                      <div className={styles.notice}>
                        * Notice: This person have used up all the over time
                        this year
                      </div>
                    )}
                    {requestData?.otTimeRemainingOfMonth === 0 && (
                      <div className={styles.notice}>
                        * Notice: This person have used up all the over time
                        this month
                      </div>
                    )}
                  </>
                )}
              </Col>
            </Row>
            <FixDataHeaderRequest requestData={requestData} />
            <Row gutter={20}>
              <Col span="12">
                <BasicSelect
                  options={REQUEST_TYPE_LIST}
                  label="Request Type"
                  placeholder="Choose request type"
                  name="requestTypeId"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </Col>
              {requestData?.status === STATUS.PENDING && (
                <>
                  {requestData?.requestTypeName === REQUEST_TYPE_KEY.LEAVE && (
                    <Col span="4">
                      <BasicInput
                        label="Remaining Time"
                        name="timeRemaining"
                        disabled
                        suffix={'days'}
                      />
                    </Col>
                  )}
                  {requestData?.requestTypeName === REQUEST_TYPE_KEY.OT && (
                    <>
                      <Col span="6">
                        <BasicInput
                          label="Remaining Time Month"
                          name="otTimeRemainingOfMonth"
                          disabled
                          suffix={'hours'}
                        />
                      </Col>
                      <Col span="6">
                        <BasicInput
                          label="Remaining Time Year"
                          name="otTimeRemainingOfYear"
                          disabled
                          suffix={'hours'}
                        />
                      </Col>
                    </>
                  )}
                </>
              )}
              {requestData?.requestTypeName === REQUEST_TYPE_KEY.DEVICE && (
                <Col span="12">
                  <BasicInput
                    label="Device Type"
                    placeholder="Choose device type"
                    name="deviceTypeName"
                    allowClear
                  />
                </Col>
              )}
            </Row>
            {(requestData?.requestTypeName ===
              REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT ||
              requestData?.requestTypeName === REQUEST_TYPE_KEY.LEAVE ||
              requestData?.requestTypeName === REQUEST_TYPE_KEY.OTHER) && (
              <Row gutter={20}>
                <Col span="12">
                  {requestData?.requestTypeName ===
                    REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT && (
                    <BasicDatePicker
                      name="date"
                      label="Applicable Date"
                      allowClear
                    />
                  )}
                  {(requestData?.requestTypeName === REQUEST_TYPE_KEY.LEAVE ||
                    requestData?.requestTypeName ===
                      REQUEST_TYPE_KEY.OTHER) && (
                    <BasicDateRangePicker
                      name="date"
                      label="Applicable Date"
                      placeholder={['From', 'To']}
                      allowClear
                    />
                  )}
                </Col>
                <Col span="12">
                  <TimeRangePicker
                    label="Applicable Time"
                    placeholder={['From', 'To']}
                    name="time"
                    disabled
                  />
                </Col>
              </Row>
            )}
            {requestData?.requestTypeName === REQUEST_TYPE_KEY.MATERNITY && (
              <Row gutter={20}>
                <Col span={12}>
                  <BasicDatePicker
                    name="date"
                    label="Start Date"
                    rules={[{ required: true }]}
                    allowClear
                  />
                </Col>
                <Col span={12}>
                  <BasicSelect
                    options={REQUEST_MATERNITY_OPTION}
                    name="periodTime"
                    label="Period time"
                    rules={[{ required: true }]}
                    allowClear
                  />
                </Col>
              </Row>
            )}
            {requestData?.requestTypeName === REQUEST_TYPE_KEY.OT && (
              <Row gutter={20}>
                <Col span="16">
                  <BasicDateRangePicker
                    name="date"
                    label="Applicable Date"
                    placeholder={['From', 'To']}
                    showTime={{
                      defaultValue: [
                        moment('00:00', 'HH:mm'),
                        moment('00:00', 'HH:mm'),
                      ],
                    }}
                    format={DATE_TIME_US}
                  />
                </Col>
              </Row>
            )}
            <Row gutter={20}>
              <Col span={24}>
                <BasicInput
                  type="textarea"
                  rows={3}
                  label="Reason"
                  name="reason"
                />
              </Col>
            </Row>
            <MultipleImagePreview src={evidenceSource} />
            {menuType === 'request-center' &&
              requestData?.status === STATUS.PENDING && (
                <>
                  <Row gutter={20} className={styles['modal__footer']}>
                    <BasicButton
                      title="Approve"
                      type="outline"
                      className={styles['btn--approve']}
                      onClick={() => {
                        handleQickActionRequest(STATUS.APPROVED);
                      }}
                      disabled={
                        (requestData?.requestTypeName ===
                          REQUEST_TYPE_KEY.LEAVE &&
                          requestData?.timeRemaining === 0) ||
                        (requestData?.requestTypeName === REQUEST_TYPE_KEY.OT &&
                          (requestData?.otTimeRemainingOfYear === 0 ||
                            requestData?.otTimeRemainingOfMonth === 0))
                      }
                    />
                    <BasicButton
                      title="Reject"
                      type="outline"
                      className={`${styles['btn--reject']} ${styles['btn--save']}`}
                      danger
                      onClick={() => {
                        handleQickActionRequest(STATUS.REJECTED);
                      }}
                      disabled={
                        (requestData?.requestTypeName ===
                          REQUEST_TYPE_KEY.LEAVE &&
                          requestData?.timeRemaining === 0) ||
                        (requestData?.requestTypeName === REQUEST_TYPE_KEY.OT &&
                          (requestData?.otTimeRemainingOfYear === 0 ||
                            requestData?.otTimeRemainingOfMonth === 0))
                      }
                    />
                  </Row>
                </>
              )}
          </Form>
        )}
      </Col>
    </Row>
  );
}
