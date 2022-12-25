import { BackwardOutlined, RollbackOutlined } from '@ant-design/icons';
import { Col, Divider, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import Loading from 'components/loading';
import NotifyPopup from 'components/NotifyPopup';
import { DATE_TIME_US, MESSAGE_RES } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { DEVICE } from 'constants/services';
import { useDeviceDetail, useReturnDevice } from 'hooks/useDevice';
import { DeviceModel, ResDeviceModify } from 'models/device';
import DeviceStatus from 'pages/device/components/statusDevice';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDateFormat } from 'utils/common';
import styles from './detailDeviceRequest.module.less';

export default function DetailDeviceRequest() {
  const { assignDeviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [requestForm] = Form.useForm();
  const [detailData, setDetailData] = useState<DeviceModel>();
  const [isShowConfirmReturn, setIsShowConfirmReturn] = useState(false);

  const {
    data: detailRequest,
    refetch: refecthDetail,
    isLoading,
  } = useDeviceDetail(assignDeviceId ?? 0, `${DEVICE.model.borrowHistory}`);
  const { mutate: returnDevice, isLoading: loadingReturn } = useReturnDevice({
    onSuccess: (response: ResDeviceModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Return device successfully' });
        refecthDetail();
      }
    },
    onError: (response: ResDeviceModify) => {
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
  useEffect(() => {
    if (detailRequest && detailRequest?.data) {
      const {
        metadata: { message },
        data: { item },
      } = detailRequest;
      if (message === MESSAGE_RES.SUCCESS && item) {
        requestForm.setFieldsValue(item);
        setDetailData(item);
        requestForm.setFieldsValue({
          borrowDate: getDateFormat(item?.borrowDate, DATE_TIME_US),
          returnDate: getDateFormat(item?.returnDate, DATE_TIME_US),
        });
      }
    }
  }, [detailRequest]);
  const type = location.pathname.split('/')[1];
  const handleBackButton = () => {
    if (type === 'human-resource')
      navigate('/human-resource/borrow-device-history');
    if (type === 'emp-self-service')
      navigate('/emp-self-service/device-history');
  };

  return (
    <>
      {(isLoading || loadingReturn) && <Loading text="Working on it..." />}
      {!isLoading && !loadingReturn && (
        <Row className={styles.container}>
          <Col
            xs={24}
            sm={20}
            md={20}
            lg={18}
            xl={16}
            xxl={16}
            className={styles.content}
          >
            <Row className={styles.header}>
              <div className={styles.header__title}>
                Device handover details
              </div>
              <BasicButton
                title="Back"
                type="filled"
                icon={<BackwardOutlined />}
                onClick={handleBackButton}
              />
            </Row>
            <Divider />
            <Form form={requestForm} layout="vertical" disabled={true}>
              <Row gutter={36} className={styles.content__header}>
                {detailData?.status && (
                  <Col span={detailData?.status === STATUS.RETURNED ? 6 : 8}>
                    <Form.Item label="Status" name="isReturned">
                      <DeviceStatus data={detailData?.status} />
                    </Form.Item>
                  </Col>
                )}
                <Col span={detailData?.status === STATUS.RETURNED ? 9 : 8}>
                  <BasicInput name="borrowDate" label="Borrowed Time" />
                </Col>
                {(detailData?.status === STATUS.RETURNED ||
                  detailData?.status === STATUS.DELETED) &&
                  detailData?.returnDate && (
                    <Col span={9}>
                      <BasicInput name="returnDate" label="Returned Time" />
                    </Col>
                  )}
                {detailData?.status === STATUS.USING &&
                  type === 'human-resource' && (
                    <Col span={8} className={styles.btn__return}>
                      <BasicButton
                        title="Return"
                        type="outline"
                        disabled={false}
                        icon={<RollbackOutlined />}
                        onClick={() => {
                          setIsShowConfirmReturn(true);
                        }}
                      />
                    </Col>
                  )}
              </Row>
              <Divider>Handover information</Divider>
              <Row gutter={36}>
                <Col span={12}>
                  <BasicInput name="rollNumber" label="Roll Number" />
                </Col>
                <Col span={12}>
                  <BasicInput name="fullName" label="Full Name" />
                </Col>
              </Row>
              <Row gutter={36}>
                <Col span={12}>
                  <BasicInput name="deviceTypeName" label="Device Type Name" />
                </Col>
                <Col span={12}>
                  <BasicInput name="deviceCode" label="Device Code" />
                </Col>
                <Col span={12}>
                  <BasicInput name="deviceName" label="Device Name" />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
      {isShowConfirmReturn && (
        <NotifyPopup
          title="Are you sure to return this device?"
          message="This action cannot be reverse"
          onCancel={() => setIsShowConfirmReturn(false)}
          onConfirm={() => {
            setIsShowConfirmReturn(false);
            returnDevice(detailData?.id ?? -1);
          }}
          visible={isShowConfirmReturn}
        />
      )}
    </>
  );
}
