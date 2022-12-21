import { Col, Form, notification, Row, Tooltip } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker, {
  RangeValue,
} from 'components/BasicDateRangePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import TimeRangePicker from 'components/TimeRangePicker';
import UploadFilePictureWall from 'components/UploadFile';
import {
  DATE_TIME,
  DATE_TIME_US,
  MESSAGE_RES,
  validateMessages,
} from 'constants/common';
import {
  ACTION_TYPE,
  REQUEST_MENU,
  REQUEST_TYPE_KEY,
  STATUS,
} from 'constants/enums/common';
import {
  REQUEST_MATERNITY_OPTION,
  REQUEST_TYPE_INTERN_LIST,
  REQUEST_TYPE_LIST,
} from 'constants/fixData';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import {
  useAddRequestModal,
  useCancelRequest,
  useChangeStatusRequest,
  useGetRemainingTime,
  useRequestDetail,
  useUpdateRequest,
} from 'hooks/useRequestList';
import { SelectBoxType } from 'models/common';
import {
  OfficeTime,
  RequestModel,
  RequestRemainingTime,
  ResRequestModify,
} from 'models/request';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { getDateFormat, TimeCombine } from 'utils/common';

import BasicDatePicker from 'components/BasicDatePicker';
import MultipleImagePreview from 'components/MultipleImagePreview';
import SelectCustomSearch from 'components/SelectCustomSearch';
import { DEVICE } from 'constants/services';
import { storageFirebase } from 'firebaseSetup';
import RollbackModal from '../components/rollbackModal';
// import detailMock from './detailMock.json';
import Loading from 'components/loading';
import NotifyPopup from 'components/NotifyPopup';
import { useGetOfficeTime } from 'hooks/useOfficeTime';
import FixDataHeaderRequest from '../components/fixDataHeaderRequest';
import NoticeRemainingTime from '../components/noticeRemainingTime';
import {
  disableDateOT,
  disabledDate,
  disabledDateForgotCheckInOut,
  disabledDateMaternity,
  disabledRangeTime,
} from './function';
import styles from './requestDetailModal.module.less';
import { useAppSelector } from 'hooks';
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
  const userInfor = useAppSelector((state) => state.auth.user);
  const [actionModal, setActionModal] = useState(action);
  const [requestData, setRequestData] = useState<RequestModel>();
  const [requestType, setRequestType] = useState<string | undefined>('');
  const [imageFileList, setImageFileList] = useState<any>([]);
  const [evidenceSource, setEvidenceSource] = useState<string[]>([]);
  const [isAllowRollback, setIsAllowRollback] = useState<number | undefined>(1);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isShowRollbackModal, setIsShowRollbackModal] = useState(false);
  const [isShowConfirmPopup, setIsShowConfirmPopup] = useState(false);
  const [dateSelected, setDateSelected] = useState<RangeValue>();
  const requestIdRefInternal = useRef<number>();
  const remainingTimeRef = useRef<RequestRemainingTime>();
  const officeTimeRef = useRef<OfficeTime>();
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
      onError: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
        cancelHandler();
      },
    });
  const { mutate: updateRequest, isLoading: loadingUpdate } = useUpdateRequest({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Update request successfully',
        });
        refetchList();
        cancelHandler();
      }
    },
    onError: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        notification.error({ message: message });
      }
      cancelHandler();
    },
  });
  const { data: detailRequest, isLoading: loadingGetDetail } = useRequestDetail(
    requestIdRef || 0,
  );
  const { data: officeTimeData } = useGetOfficeTime();
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
    onError: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        notification.error({ message: message });
      }
    },
  });
  const { mutate: remainingTimeRequest, isLoading: loadingGetRemaining } =
    useGetRemainingTime({
      onSuccess: (response: ResRequestModify) => {
        const {
          metadata: { message },
          data: { item },
        } = response;
        if (message === 'Success') {
          requestForm.setFieldsValue({
            timeRemaining: item?.timeRemaining?.toFixed(2),
            otTimeRemainingOfMonth: item?.otTimeRemainingOfMonth?.toFixed(2),
            otTimeRemainingOfYear: item?.otTimeRemainingOfYear?.toFixed(2),
          });
          remainingTimeRef.current = item;
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
  const { mutate: cancelRequest, isLoading: loadingCancelRequest } =
    useCancelRequest({
      onSuccess: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        if (message === 'Success') {
          notification.success({
            message: 'Cancel request successfully',
          });
          refetchList();
          onCancel();
        }
      },
      onError: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
        refetchList();
        onCancel();
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
        requestForm.setFieldsValue({
          timeRemaining: item?.timeRemaining?.toFixed(2),
          otTimeRemainingOfMonth: item?.otTimeRemainingOfMonth?.toFixed(2),
          otTimeRemainingOfYear: item?.otTimeRemainingOfYear?.toFixed(2),
        });
        if (item?.listEvidence) {
          setEvidenceSource(item?.listEvidence);
        }
        setRequestType(item?.requestTypeName);
        setIsAllowRollback(item?.isAllowRollback);
        requestIdRefInternal.current = item?.id;
        const timeRemaining: RequestRemainingTime = {
          timeRemaining: item?.timeRemaining,
          otTimeRemainingOfMonth: item?.otTimeRemainingOfMonth,
          otTimeRemainingOfYear: item?.otTimeRemainingOfYear,
        };
        remainingTimeRef.current = timeRemaining;
      }
    }
  }, [detailRequest]);
  useEffect(() => {
    if (officeTimeData && officeTimeData?.data) {
      const {
        data: { item },
      } = officeTimeData;
      officeTimeRef.current = item;
    }
  }, []);
  const cancelHandler = () => {
    onCancel();
    requestForm.resetFields();
  };
  const submitHandler = async (formValues: RequestModel) => {
    switch (requestType) {
      case REQUEST_TYPE_KEY.LEAVE:
      case REQUEST_TYPE_KEY.OTHER: {
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
        break;
      }
      case REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT: {
        formValues.startTime = TimeCombine(
          formValues.date,
          formValues.time && formValues.time[0],
          DATE_TIME,
        );
        formValues.endTime = TimeCombine(
          formValues.date,
          formValues.time && formValues.time[1],
          DATE_TIME,
        );
        break;
      }
      case REQUEST_TYPE_KEY.OT: {
        if (formValues.date) {
          formValues.startTime = getDateFormat(formValues.date[0], DATE_TIME);
          formValues.endTime = getDateFormat(formValues.date[1], DATE_TIME);
        }
        break;
      }
      case REQUEST_TYPE_KEY.MATERNITY: {
        formValues.startTime = getDateFormat(
          moment(formValues.date).startOf('days'),
          DATE_TIME,
        );
        formValues.endTime = getDateFormat(
          moment(formValues.date)
            .add(formValues.periodTime, 'months')
            .endOf('days'),
          DATE_TIME,
        );
      }
    }
    const urlImage = await uploadImage();
    formValues.listEvidence = [...urlImage, ...evidenceSource];
    delete formValues.date;
    delete formValues.time;
    delete formValues.timeRemaining;
    if (requestIdRef && actionModal !== ACTION_TYPE.ASSIGN) {
      updateRequest({ uid: requestIdRef, body: formValues });
    } else {
      createRequest(formValues);
    }
  };

  //* upload image to firebase and get the image url link
  const uploadImage = async () => {
    setIsUploadingImage(true);
    let imgUrl: string[] = [];
    for (let i = 0; i < imageFileList.length; i++) {
      const imageRef = ref(
        storageFirebase,
        `images/evidences/${imageFileList[i].name}-${Math.random()}`,
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
      });
  };

  const handleChangeRequestType = (value: number, options: SelectBoxType) => {
    requestForm.resetFields();
    requestForm.setFieldValue('requestTypeId', value);
    requestIdRefInternal.current = value;
    options?.type && setRequestType(options?.type);
    if (
      options?.type === REQUEST_TYPE_KEY.LEAVE ||
      options?.type === REQUEST_TYPE_KEY.OT
    ) {
      const data: RequestRemainingTime = {
        requestTypeId: value,
        month: moment().get('month') + 1,
        year: moment().get('year'),
      };
      remainingTimeRequest(data);
    }
  };

  const handleQickActionRequest = (statusValue: string) => {
    requestIdRef &&
      statusRequest({
        uid: requestIdRef,
        body: { status: statusValue },
      });
    setIsShowRollbackModal(false);
    onCancel();
  };

  const handleChangeDate = (dates: [moment.Moment, moment.Moment]) => {
    const isCurrentMonth =
      moment(dates[0]).get('month') === moment().get('month') &&
      moment(dates[1]).get('month') === moment().get('month') &&
      moment(dates[0]).get('year') === moment().get('year') &&
      moment(dates[1]).get('year') === moment().get('year');
    if (dates && !isCurrentMonth) {
      const data: RequestRemainingTime = {
        requestTypeId: requestIdRefInternal.current,
        month: moment(dates[0]).get('month') + 1,
        year: moment(dates[0]).get('year'),
      };
      remainingTimeRequest(data);
    }
  };

  return (
    <>
      <CommonModal
        open={isVisible}
        title={'REQUEST INFORMATION'}
        onCancel={cancelHandler}
        footer={false}
        width={850}
        closeIcon
      >
        <>
          {(loadingGetDetail ||
            loadingGetRemaining ||
            loadingCreate ||
            isUploadingImage ||
            loadingUpdate ||
            loadingCancelRequest) && <Loading text="Working on it..." />}
          {!(
            loadingGetDetail ||
            loadingGetRemaining ||
            loadingCreate ||
            isUploadingImage ||
            loadingUpdate ||
            loadingCancelRequest
          ) && (
            <>
              <Form
                form={requestForm}
                layout="vertical"
                requiredMark
                validateMessages={validateMessages()}
                onFinish={submitHandler}
                disabled={
                  actionModal === ACTION_TYPE.VIEW_DETAIL ||
                  requestStatus !== STATUS.PENDING
                }
              >
                {actionModal !== ACTION_TYPE.CREATE && (
                  <FixDataHeaderRequest requestData={requestData} />
                )}
                <Row gutter={20}>
                  <Col span="12">
                    <BasicSelect
                      options={
                        userInfor?.rankId === 1
                          ? REQUEST_TYPE_INTERN_LIST
                          : REQUEST_TYPE_LIST
                      }
                      label="Request Type"
                      rules={[{ required: true }]}
                      placeholder="Choose request type"
                      name="requestTypeId"
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      onChange={handleChangeRequestType}
                      disabled={
                        actionModal === ACTION_TYPE.VIEW_DETAIL ||
                        actionModal === ACTION_TYPE.EDIT
                      }
                    />
                  </Col>
                  {requestStatus === STATUS.PENDING && (
                    <>
                      {requestType === REQUEST_TYPE_KEY.LEAVE && (
                        <Col span="6">
                          <BasicInput
                            label="Remaining Time"
                            name="timeRemaining"
                            disabled
                            suffix={'days'}
                          />
                        </Col>
                      )}
                      {requestType === REQUEST_TYPE_KEY.OT && (
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
                  {requestType === REQUEST_TYPE_KEY.DEVICE && (
                    <Col span="12">
                      <SelectCustomSearch
                        url={`${DEVICE.model.deviceType}-${DEVICE.model.masterData}`}
                        dataName="items"
                        apiName="device-type-master-data"
                        label="Device Type"
                        rules={[{ required: true }]}
                        placeholder="Choose device type"
                        name={
                          requestData?.isDeviceTypeDeleted
                            ? 'deviceTypeName'
                            : 'deviceTypeId'
                        }
                        allowClear
                      />
                    </Col>
                  )}
                </Row>
                <Row gutter={20}>
                  <Col span={24}>
                    <NoticeRemainingTime
                      remainingTimeRef={remainingTimeRef.current}
                      requestType={requestType}
                      tabType={tabType}
                    />
                  </Col>
                </Row>
                {(requestType === REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT ||
                  requestType === REQUEST_TYPE_KEY.LEAVE ||
                  requestType === REQUEST_TYPE_KEY.OTHER) && (
                  <Row gutter={20}>
                    <Col span="12">
                      {requestType === REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT && (
                        <BasicDatePicker
                          name="date"
                          label="Applicable Date"
                          rules={[{ required: true }]}
                          allowClear
                          disabledDate={(current) =>
                            disabledDateForgotCheckInOut(current)
                          }
                        />
                      )}
                      {(requestType === REQUEST_TYPE_KEY.LEAVE ||
                        requestType === REQUEST_TYPE_KEY.OTHER) && (
                        <BasicDateRangePicker
                          name="date"
                          label="Applicable Date"
                          rules={[{ required: true }]}
                          placeholder={['From', 'To']}
                          allowClear
                          onChange={handleChangeDate}
                          disabledDate={(current) =>
                            disabledDate(current, dateSelected)
                          }
                          onCalendarChange={(values: RangeValue) => {
                            setDateSelected(values);
                          }}
                        />
                      )}
                    </Col>
                    <Col span="12">
                      <TimeRangePicker
                        label="Applicable Time"
                        rules={[{ required: true }]}
                        placeholder={['From', 'To']}
                        name="time"
                        disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
                        disableTime={(value, type) =>
                          disabledRangeTime(
                            value,
                            type,
                            requestType,
                            dateSelected,
                            officeTimeRef.current,
                          )
                        }
                        hideDisabledOptions
                      />
                    </Col>
                  </Row>
                )}
                {requestType === REQUEST_TYPE_KEY.MATERNITY && (
                  <Row gutter={20}>
                    <Col span={12}>
                      <BasicDatePicker
                        name="date"
                        label="Start Date"
                        rules={[{ required: true }]}
                        allowClear
                        disabledDate={(current) =>
                          disabledDateMaternity(current)
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <BasicSelect
                        options={REQUEST_MATERNITY_OPTION}
                        name="periodTime"
                        label="Period time"
                        rules={[{ required: true }]}
                        allowClear
                        placeholder="Choose period time"
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
                        showTime={{
                          defaultValue: [
                            moment('00:00', 'HH:mm'),
                            moment('00:00', 'HH:mm'),
                          ],
                        }}
                        format={DATE_TIME_US}
                        disabledDate={(current) =>
                          disableDateOT(current, dateSelected)
                        }
                        disabledTime={(value, type) =>
                          disabledRangeTime(
                            value,
                            type,
                            requestType,
                            dateSelected,
                            officeTimeRef.current,
                          )
                        }
                        onCalendarChange={(values: RangeValue) => {
                          setDateSelected(values);
                        }}
                        allowClear
                        hideDisabledOptions
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
                      rules={[{ whitespace: true }]}
                    />
                  </Col>
                </Row>
                {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
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
                {(actionModal === ACTION_TYPE.VIEW_DETAIL ||
                  actionModal === ACTION_TYPE.EDIT) && (
                  <MultipleImagePreview
                    src={evidenceSource}
                    allowRemove={actionModal === ACTION_TYPE.EDIT}
                    handleRemoveFile={handleRemoveFile}
                  />
                )}
                {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
                  <div className={styles['modal__footer']}>
                    <BasicButton
                      title="Close"
                      type="outline"
                      className={styles['btn--cancel']}
                      onClick={cancelHandler}
                    />
                    {actionModal === ACTION_TYPE.CREATE && (
                      <BasicButton
                        title="Send"
                        type="filled"
                        className={styles['btn--save']}
                        htmlType={'submit'}
                        disabled={
                          (remainingTimeRef.current?.timeRemaining === 0 &&
                            requestType === REQUEST_TYPE_KEY.LEAVE) ||
                          (requestType === REQUEST_TYPE_KEY.OT &&
                            remainingTimeRef.current?.otTimeRemainingOfYear ===
                              0) ||
                          remainingTimeRef.current?.otTimeRemainingOfMonth === 0
                        }
                      />
                    )}
                    {actionModal === ACTION_TYPE.EDIT && (
                      <BasicButton
                        title="Update"
                        type="filled"
                        className={styles['btn--save']}
                        htmlType={'submit'}
                        disabled={
                          (requestType === REQUEST_TYPE_KEY.LEAVE &&
                            remainingTimeRef.current?.timeRemaining === 0) ||
                          (requestType === REQUEST_TYPE_KEY.OT &&
                            (remainingTimeRef.current?.otTimeRemainingOfYear ===
                              0 ||
                              remainingTimeRef.current
                                ?.otTimeRemainingOfMonth === 0))
                        }
                      />
                    )}
                  </div>
                )}
              </Form>
              {actionModal === ACTION_TYPE.VIEW_DETAIL && (
                <div className={styles['modal__footer']}>
                  <BasicButton
                    title="Close"
                    type="outline"
                    className={styles['btn--cancel']}
                    onClick={cancelHandler}
                  />
                  {requestStatus === STATUS.PENDING && (
                    <div>
                      {tabType === REQUEST_MENU.MY_REQUEST && (
                        <>
                          <BasicButton
                            title="Edit"
                            type="outline"
                            className={styles['btn--save']}
                            onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                          />
                          {requestIdRef && (
                            <Tooltip title="Cancel request">
                              <span>
                                <BasicButton
                                  title="Cancel"
                                  type="outline"
                                  className={`${styles['btn--reject']} ${styles['btn--save']}`}
                                  danger
                                  onClick={() => setIsShowConfirmPopup(true)}
                                />
                              </span>
                            </Tooltip>
                          )}
                        </>
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
                            disabled={
                              (requestType === REQUEST_TYPE_KEY.LEAVE &&
                                remainingTimeRef.current?.timeRemaining ===
                                  0) ||
                              (requestType === REQUEST_TYPE_KEY.OT &&
                                (remainingTimeRef.current
                                  ?.otTimeRemainingOfYear === 0 ||
                                  remainingTimeRef.current
                                    ?.otTimeRemainingOfMonth === 0))
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
                              (requestType === REQUEST_TYPE_KEY.LEAVE &&
                                remainingTimeRef.current?.timeRemaining ===
                                  0) ||
                              (requestType === REQUEST_TYPE_KEY.OT &&
                                (remainingTimeRef.current
                                  ?.otTimeRemainingOfYear === 0 ||
                                  remainingTimeRef.current
                                    ?.otTimeRemainingOfMonth === 0))
                            }
                          />
                        </>
                      )}
                    </div>
                  )}
                  {(requestStatus === STATUS.APPROVED ||
                    requestStatus === STATUS.REJECTED) &&
                    !!isAllowRollback &&
                    tabType === REQUEST_MENU.SUBORDINATE && (
                      <BasicButton
                        title="Roll back"
                        type="outline"
                        className={`${styles['btn--reject']} ${styles['btn--save']}`}
                        danger
                        onClick={() => setIsShowRollbackModal(true)}
                      />
                    )}
                </div>
              )}
            </>
          )}
        </>
      </CommonModal>
      {isShowRollbackModal && (
        <RollbackModal
          isVisible={isShowRollbackModal}
          onCancel={() => setIsShowRollbackModal(false)}
          handleQickActionRequest={handleQickActionRequest}
          requestStatus={requestStatus}
        />
      )}
      {isShowConfirmPopup && (
        <NotifyPopup
          visible={isShowConfirmPopup}
          onCancel={() => setIsShowConfirmPopup(false)}
          onConfirm={() => {
            setIsShowConfirmPopup(false);
            requestIdRef && cancelRequest(requestIdRef);
          }}
          title="Are you sure to cancel this request?"
          message="This action cannot be reverse"
        />
      )}
    </>
  );
}
