import { BackwardOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import { DATE_TIME_US, MESSAGE_RES } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { DEVICE } from 'constants/services';
import { useDeviceDetail } from 'hooks/useDevice';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDateFormat } from 'utils/common';
import RequestStatus from '../components/statusRequest';
import styles from './detailDeviceRequest.module.less';
export default function DetailDeviceRequest() {
  const { assignDeviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [requestForm] = Form.useForm();
  const statusRef = useRef<Number | undefined>(undefined);
  const { data: detailRequest } = useDeviceDetail(
    assignDeviceId ?? 0,
    `${DEVICE.model.borrowHistory}`,
  );
  useEffect(() => {
    if (detailRequest && detailRequest?.data) {
      const {
        metadata: { message },
        data: { item },
      } = detailRequest;
      if (message === MESSAGE_RES.SUCCESS && item) {
        requestForm.setFieldsValue(item);
        statusRef.current = item.isReturned;
        requestForm.setFieldsValue({
          borrowDate: getDateFormat(item?.borrowDate, DATE_TIME_US),
          returnDate: getDateFormat(item?.returnDate, DATE_TIME_US),
        });
      }
    }
  }, [detailRequest]);
  const handleBackButton = () => {
    const type = location.pathname.split('/')[1];
    if (type === 'human-resource')
      navigate('/human-resource/borrow-device-history');
    if (type === 'emp-self-service')
      navigate('/emp-self-service/device-history');
    statusRef.current = undefined;
  };

  return (
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
          <div className={styles.header__title}>Device handover details</div>
          <BasicButton
            title="Back"
            type="filled"
            icon={<BackwardOutlined />}
            onClick={handleBackButton}
          />
        </Row>
        <Divider />
        <Form form={requestForm} layout="vertical" requiredMark disabled={true}>
          <Row gutter={36}>
            <Col span={!!statusRef.current ? 6 : 12}>
              <Form.Item label="Status" name="isReturned">
                <RequestStatus
                  data={!!statusRef.current ? STATUS.RETURNED : STATUS.USING}
                />
              </Form.Item>
            </Col>
            <Col span={!!statusRef.current ? 9 : 12}>
              <BasicInput name="borrowDate" label="Borrow Time" />
            </Col>
            {!!statusRef.current && (
              <Col span={9}>
                <BasicInput name="returnDate" label="Returned Date" />
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
  );
}
