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
  DATE_TIME_US,
  MESSAGE_RES,
  US_DATE_FORMAT,
  validateMessages,
} from 'constants/common';
import {
  ACTION_TYPE,
  REQUEST_MENU,
  REQUEST_TYPE_KEY,
  STATUS,
} from 'constants/enums/common';
import { REQUEST_TYPE_LIST } from 'constants/fixData';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  useAddRequestModal,
  useChangeStatusRequest,
  useGetRemainingTime,
  useRequestDetail,
  useUpdateRequest,
} from 'hooks/useRequestList';
import { SelectBoxType } from 'models/common';
import {
  RequestModel,
  RequestRemainingTime,
  ResRequestModify,
} from 'models/request';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { getDateFormat, TimeCombine } from 'utils/common';
import RequestStatus from '../statusRequest';

import MultipleImagePreview from 'components/MultipleImagePreview';
import { storageFirebase } from 'firebaseSetup';
// import detailMock from './detailMock.json';
import styles from './requestDetailModal.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList: () => void;
  action: ACTION_TYPE;
  requestIdRef?: number;
  requestStatus?: string;
  tabType?: string;
}
export default function RequestDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  requestIdRef,
  requestStatus,
  tabType,
}: IProps) {
  const [requestForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  const [requestData, setRequestData] = useState<RequestModel>();
  const [requestType, setRequestType] = useState<string | undefined>('');
  const [imageFileList, setImageFileList] = useState<any>([]);
  const [evidenceSource, setEvidenceSource] = useState<string[]>([]);
  const requestRemainingTime = useRef<RequestRemainingTime>({
    requestTypeId: requestIdRef,
    month: moment().get('month'),
    year: moment().get('year'),
  });
  const { mutate: createRequest, isLoading: loadingCreate } =
    useAddRequestModal({
      onSuccess: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;

        if (message === 'Success') {
          notification.success({
            message: 'Send request successfully',
          });
          refetchList();
          cancelHandler();
        }
      },
    });
  const { mutate: updateRequest, isLoading: loadingUpdate } = useUpdateRequest({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Send request successfully',
        });
        refetchList();
        cancelHandler();
      }
    },
  });
  const { data: detailRequest } = useRequestDetail(requestIdRef || 0);
  const { mutate: statusRequest } = useChangeStatusRequest({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === 'Success') {
        notification.success({
          message: 'Responding request successfully',
        });
        refetchList();
      }
    },
  });
  const { mutate: remainingTimeRequest } = useGetRemainingTime({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
        data: { items: remainingTime },
      } = response;
      if (message === 'Success') {
        requestRemainingTime.current = remainingTime;
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
        requestForm.setFieldsValue(item);
        requestForm.setFieldsValue({
          timeRemaining: item?.timeRemaining?.toFixed(2),
          date: [moment(item.startTime), moment(item.endTime)],
          time: [moment(item.startTime), moment(item.endTime)],
        });
        if (item?.listEvidence) {
          setEvidenceSource(item?.listEvidence);
        }
        const requestFixInfor: RequestModel = {
          id: item.id,
          receiver: item.receiver,
          createdBy: item.personName,
          createDate: getDateFormat(item.createDate, US_DATE_FORMAT),
          status: item.status,
          approvalDate:
            item.approvalDate !== null
              ? getDateFormat(item?.approvalDate, US_DATE_FORMAT)
              : undefined,
        };
        setRequestData(requestFixInfor);
        setRequestType(item?.requestTypeName);
      }
    }
  }, [detailRequest]);
  const cancelHandler = () => {
    onCancel();
    requestForm.resetFields();
  };
  const submitHandler = async (formValues: RequestModel) => {
    if (requestType === REQUEST_TYPE_KEY.LEAVE) {
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
    }
    if (requestType === REQUEST_TYPE_KEY.OT && formValues.date) {
      formValues.startTime = getDateFormat(formValues.date[0], DATE_TIME);
      formValues.endTime = getDateFormat(formValues.date[1], DATE_TIME);
    }
    const urlImage = await uploadImage();
    formValues.listEvidence = [...urlImage, ...evidenceSource];
    delete formValues.date;
    delete formValues.time;
    delete formValues.timeRemaining;
    !formValues.reason && delete formValues.reason;
    if (requestIdRef) {
      updateRequest({ uid: requestIdRef, body: formValues });
    } else {
      createRequest(formValues);
    }
  };

  //* upload image to firebase and get the image url link
  const uploadImage = async () => {
    let imgUrl: string[] = [];
    for (let i = 0; i < imageFileList.length; i++) {
      const imageRef = ref(
        storageFirebase,
        `images/evidences/${imageFileList[i].name}`,
      );
      await uploadBytes(imageRef, imageFileList[i])
        .then(async () => {
          await getDownloadURL(imageRef)
            .then((url) => {
              imgUrl.push(url);
            })
            .catch((error) => {
              notification.error({
                message: 'Get download link error',
              });
              console.error(error);
            });
        })
        .catch((error) => {
          notification.error({
            message: 'Upload file error',
          });
          console.error(error);
        });
    }
    return imgUrl;
  };

  // * Remove image from firebase
  const handleRemoveFile = (url: string) => {
    const fileRef = ref(storageFirebase, url);
    return deleteObject(fileRef)
      .then(() => {
        const newEvidenceSource = evidenceSource.filter((el: string) => {
          return el !== url;
        });
        setEvidenceSource(newEvidenceSource);
        notification.success({
          message: 'Delete file successfully',
        });
      })
      .catch((error) => {
        notification.error({
          message: 'Delete file error',
        });
        console.error(error);
      });
  };

  const handleChangeRequestType = (_: number, options: SelectBoxType) => {
    options?.type && setRequestType(options?.type);
    const data: RequestRemainingTime = {
      requestTypeId: options.value,
      month: moment().get('month') + 1,
      year: moment().get('year'),
    };
    remainingTimeRequest(data);
  };

  const handleQickActionRequest = (statusValue: string) => {
    requestIdRef &&
      statusRequest({
        uid: requestIdRef,
        body: { status: statusValue },
      });
  };
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
                name="requestTypeId"
                allowClear
                showSearch
                optionFilterProp="label"
                onChange={handleChangeRequestType}
                disabled={actionModal === ACTION_TYPE.EDIT}
              />
            </Col>
            {(requestType === REQUEST_TYPE_KEY.LEAVE ||
              requestType === REQUEST_TYPE_KEY.OT) &&
              requestStatus === STATUS.PENDING && (
                <Col span="5">
                  <BasicInput
                    label="Remaining Time"
                    name="timeRemaining"
                    disabled
                    suffix={
                      requestType === REQUEST_TYPE_KEY.LEAVE ? 'days' : 'hours'
                    }
                  />
                </Col>
              )}
            {requestType === REQUEST_TYPE_KEY.DEVICE && (
              <Col span="12">
                <BasicSelect
                  options={REQUEST_TYPE_LIST}
                  label="Device Type"
                  rules={[{ required: true }]}
                  placeholder="Choose device type"
                  name="deviceTypeId"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  disabled={actionModal === ACTION_TYPE.EDIT}
                />
              </Col>
            )}
          </Row>
          {(requestType === REQUEST_TYPE_KEY.LEAVE ||
            requestType === REQUEST_TYPE_KEY.OTHER) && (
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
          {requestType === REQUEST_TYPE_KEY.OT && (
            <Row gutter={20}>
              <Col span="16">
                <BasicDateRangePicker
                  name="date"
                  label="Applicable Date"
                  rules={[{ required: true }]}
                  placeholder={['From', 'To']}
                  showTime
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
                placeholder="Enter your reason . . ."
                label="Reason"
                name="reason"
                allowClear
              />
            </Col>
          </Row>
          {(requestType === REQUEST_TYPE_KEY.LEAVE ||
            requestType === REQUEST_TYPE_KEY.OTHER) &&
            actionModal !== ACTION_TYPE.VIEW_DETAIL && (
              <Row gutter={20}>
                <Col span={24}>
                  <Form.Item
                    label="Evidence"
                    className={styles.form__upload}
                    name="evidence"
                  >
                    <UploadFilePictureWall
                      fileUpload={imageFileList}
                      setFileUpload={setImageFileList}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          {requestType !== REQUEST_TYPE_KEY.DEVICE &&
            (actionModal === ACTION_TYPE.VIEW_DETAIL ||
              actionModal === ACTION_TYPE.EDIT) && (
              <MultipleImagePreview
                src={evidenceSource}
                allowRemove={actionModal === ACTION_TYPE.EDIT}
                handleRemoveFile={handleRemoveFile}
              />
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
                  loading={loadingCreate}
                />
              )}
              {actionModal === ACTION_TYPE.EDIT && (
                <BasicButton
                  title="Update"
                  type="filled"
                  className={styles['btn--save']}
                  htmlType={'submit'}
                  loading={loadingUpdate}
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
                {tabType === REQUEST_MENU.MY_REQUEST && (
                  <BasicButton
                    title="Edit"
                    type="filled"
                    className={styles['btn--save']}
                    onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                  />
                )}
                {tabType === REQUEST_MENU.SUBORDINATE && (
                  <>
                    <BasicButton
                      title="Approve"
                      type="outline"
                      className={styles['btn--approve']}
                      onClick={() => {
                        handleQickActionRequest(STATUS.APPROVED);
                      }}
                    />
                    <BasicButton
                      title="Reject"
                      type="outline"
                      className={`${styles['btn--reject']} ${styles['btn--save']}`}
                      danger
                      onClick={() => {
                        handleQickActionRequest(STATUS.REJECTED);
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
