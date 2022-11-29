import { Col, Divider, Form, Row } from 'antd';
import BasicInput from 'components/BasicInput';
import { DATE_TIME_US, MESSAGE_RES } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { DEVICE } from 'constants/services';
import { useDeviceDetail } from 'hooks/useDevice';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDateFormat } from 'utils/common';
import RequestStatus from '../components/statusRequest';
import styles from './detailDeviceRequest.module.less';
export default function DetailDeviceRequest() {
  const { assignDeviceId } = useParams();
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
          returnDate: getDateFormat(item?.borrowDate, DATE_TIME_US),
        });
      }
    }
  }, [detailRequest]);
  return (
    <Row className={styles.container}>
      <Col xs={24} sm={20} md={20} lg={18} xl={16} xxl={16}>
        <div className={styles.header__title}>Detail Device</div>
        <Divider />
        <Form form={requestForm} layout="vertical" requiredMark disabled={true}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item label="Status" name="isReturned">
                <RequestStatus
                  data={!!statusRef.current ? STATUS.RETURNED : STATUS.USING}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <BasicInput name="deviceTypeName" label="Device Type Name" />
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={12}>
              <BasicInput name="deviceCode" label="Device Code" />
            </Col>
            <Col span={12}>
              <BasicInput name="deviceName" label="Device Name" />
            </Col>
          </Row>
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
              <BasicInput name="borrowDate" label="Borrow Time" />
            </Col>
            <Col span={12}>
              <BasicInput name="returnDate" label="Returned Date" />
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
