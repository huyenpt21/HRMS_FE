import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import TimeRangePicker from 'components/TimeRangePicker';
import UploadFilePictureWall from 'components/UploadFile';
import {
  DATE_TIME,
  MESSAGE_RES,
  US_DATE_FORMAT,
  validateMessages,
} from 'constants/common';
import {
  ACTION_TYPE,
  REQUEST_TYPE_KEY,
  STATUS,
  TAB_REQUEST_TYPE,
} from 'constants/enums/common';
import { REQUEST_TYPE_LIST } from 'constants/fixData';
import { useAddRequestModal } from 'hooks/useRequestList';
import { SelectBoxType } from 'models/common';
import { RequestModel, ResRequestModify } from 'models/request';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { getDateFormat, TimeCombine } from 'utils/common';
import RequestStatus from '../RequestStatus';
import detailMock from './detailMock.json';
import styles from './requestDetailModal.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
  action: ACTION_TYPE;
  requestId?: number;
  requestStatus?: string;
  tabType?: string;
}
export default function RequestDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  requestId,
  requestStatus,
  tabType,
}: IProps) {
  const [requestForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  const [requestData, setRequestData] = useState<RequestModel>();
  const [requestType, setRequestType] = useState('');
  const { mutate: createRequest } = useAddRequestModal({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Send request successfully',
        });
        // refetchList();
      }
    },
  });
  const detailRequest =
    actionModal === ACTION_TYPE.CREATE ? undefined : detailMock;
  useEffect(() => {
    if (detailRequest && detailRequest?.data) {
      const {
        metadata: { message },
        data: { items },
      } = detailRequest;
      if (message === MESSAGE_RES.SUCCESS && items) {
        requestForm.setFieldsValue(items);
        requestForm.setFieldValue('date', [
          moment(items.startTime),
          moment(items.endTime),
        ]);
        requestForm.setFieldValue('time', [
          moment(items.startTime),
          moment(items.endTime),
        ]);
        const requestFixInfor: RequestModel = {
          id: items.requestId,
          receiver: items.receiver,
          createdBy: items.personName,
          createDate: getDateFormat(items.createDate, US_DATE_FORMAT),
          status: items.status,
          approvalDate:
            items.approvalDate !== null
              ? getDateFormat(items?.approvalDate, US_DATE_FORMAT)
              : undefined,
        };
        setRequestData(requestFixInfor);
      }
    }
  }, [detailRequest]);
  const cancelHandler = () => {
    onCancel();
    requestForm.resetFields();
  };
  const submitHandler = (formValues: RequestModel) => {
    formValues.startTime = TimeCombine(
      formValues.date && formValues.date[0],
      formValues.time && formValues.time[0],
      DATE_TIME,
    );
    formValues.endTime = TimeCombine(
      formValues.date && formValues.date[1],
      formValues.time && formValues.time[1],
      DATE_TIME,
    );
    delete formValues.date;
    delete formValues.time;
    createRequest(formValues);
  };

  const handleChangeRequestType = (_: number, options: SelectBoxType) => {
    options?.type && setRequestType(options?.type);
  };

  const handleQickActionRequest = (isApprove: boolean) => {};
  return (
    <CommonModal
      open={isVisible}
      title={'REQUEST INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={850}
      closeIcon
    >
      <>
        <Form
          form={requestForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
        >
          {actionModal !== ACTION_TYPE.CREATE && (
            <>
              <Row gutter={20} className={styles['infor--header']}>
                <Col span={12}>
                  <span>Created By:</span>
                  <span className={styles['text--bold']}>
                    {requestData?.createdBy}
                  </span>
                </Col>
                <Col span={12}>
                  <span>Created Date:</span>
                  <span className={styles['text--bold']}>
                    {requestData?.createDate}
                  </span>
                </Col>
              </Row>
              <Row gutter={20} className={styles['infor--header']}>
                <Col span={12}>
                  <span>Receiver:</span>
                  <span className={styles['text--bold']}>
                    {requestData?.receiver}
                  </span>
                </Col>
                <Col span={5}>
                  <span>Status:</span>{' '}
                  <RequestStatus data={requestData?.status ?? ''} />
                </Col>
                {requestData?.approvalDate && (
                  <Col span={7}>
                    <span>Approval Date:</span>
                    <span className={styles['text--bold']}>
                      {requestData?.approvalDate}
                    </span>
                  </Col>
                )}
              </Row>
            </>
          )}

          <Row gutter={20}>
            <Col span="12">
              <BasicSelect
                options={REQUEST_TYPE_LIST}
                label="Request Type"
                rules={[{ required: true }]}
                placeholder="Choose request type"
                name="requestTypeName"
                allowClear
                showSearch
                optionFilterProp="label"
                onChange={handleChangeRequestType}
                disabled={actionModal === ACTION_TYPE.EDIT}
              />
            </Col>
            {requestType !== REQUEST_TYPE_KEY.DEVICE &&
              actionModal !== ACTION_TYPE.CREATE && (
                <Col span="4">
                  <BasicInput
                    label="Remaining Time"
                    name="reaminingTimeOff"
                    disabled
                  />
                </Col>
              )}
          </Row>
          {requestType !== REQUEST_TYPE_KEY.DEVICE && (
            <Row gutter={20}>
              <Col span="12">
                <BasicDateRangePicker
                  name="date"
                  label="Applicable Date"
                  rules={[{ required: true }]}
                  placeholder={['From', 'To']}
                />
              </Col>
              <Col span="12">
                <TimeRangePicker
                  label="Applicable Time"
                  rules={[{ required: true }]}
                  placeholder={['From', 'To']}
                  name="time"
                  disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
                />
              </Col>
            </Row>
          )}
          <Row gutter={20}>
            <Col span={24}>
              <BasicInput
                type="textarea"
                rows={3}
                placeholder="Enter your reason . . ."
                label="Reason"
                rules={[{ required: true }]}
                name="reason"
                allowClear
              />
            </Col>
          </Row>
          {requestType !== REQUEST_TYPE_KEY.DEVICE && (
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  label="Evidence"
                  className={styles.form__upload}
                  name="evidence"
                >
                  <UploadFilePictureWall />
                </Form.Item>
              </Col>
            </Row>
          )}
          {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
            <div className={styles['modal__footer']}>
              {(actionModal === ACTION_TYPE.CREATE ||
                actionModal === ACTION_TYPE.EDIT) && (
                <BasicButton
                  title="Cancel"
                  type="outline"
                  className={styles['btn--cancel']}
                  onClick={cancelHandler}
                />
              )}
              {actionModal === ACTION_TYPE.CREATE && (
                <BasicButton
                  title="Send"
                  type="filled"
                  className={styles['btn--save']}
                  htmlType={'submit'}
                />
              )}
              {actionModal === ACTION_TYPE.EDIT && (
                <BasicButton
                  title="Update"
                  type="filled"
                  className={styles['btn--save']}
                  htmlType={'submit'}
                />
              )}
            </div>
          )}
        </Form>
        {actionModal === ACTION_TYPE.VIEW_DETAIL && (
          <div className={styles['modal__footer']}>
            <BasicButton
              title="Cancel"
              type="outline"
              className={styles['btn--cancel']}
              onClick={cancelHandler}
            />
            {requestStatus === STATUS.PENDING && (
              <div>
                {tabType === TAB_REQUEST_TYPE.MY_REQUEST && (
                  <BasicButton
                    title="Edit"
                    type="filled"
                    className={styles['btn--save']}
                    onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                  />
                )}
                {tabType === TAB_REQUEST_TYPE.SUBORDINATE && (
                  <>
                    <BasicButton
                      title="Approve"
                      type="filled"
                      className={styles['btn--approve']}
                      onClick={() => {
                        handleQickActionRequest(true);
                      }}
                    />
                    <BasicButton
                      title="Reject"
                      type="filled"
                      className={styles['btn--save']}
                      danger
                      onClick={() => {
                        handleQickActionRequest(false);
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </>
    </CommonModal>
  );
}
