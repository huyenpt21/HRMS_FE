import { Col, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import SelectCustomSearch from 'components/SelectCustomSearch';
import { validateMessages } from 'constants/common';
import { ACTION_TYPE, STATUS_COLORS } from 'constants/enums/common';
import { DEVICE } from 'constants/services';
import { useDeviceDetail } from 'hooks/useDevice';
import { DeviceModel } from 'models/device';
import { useEffect, useState, useRef } from 'react';
import styles from './detailModalDevice.module.less';
// import dataDetail from './dataDetail.json';
import BasicTag from 'components/BasicTag';
interface IProps {
  deviceIdRef?: number;
  isVisible: boolean;
  onCancel: () => void;
  action: ACTION_TYPE;
}
export default function DetailModalDevice({
  isVisible,
  onCancel,
  deviceIdRef,
  action,
}: IProps) {
  const [deviceForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  const detailDeviceData = useRef<DeviceModel>();
  const { data: detailDevice } = useDeviceDetail(
    deviceIdRef,
    `${DEVICE.model.itSupport}/${DEVICE.service}`,
  );
  useEffect(() => {
    if (detailDevice && detailDevice?.data) {
      const {
        data: { item },
      } = detailDevice;
      deviceForm.setFieldsValue(item);
      detailDeviceData.current = item;
    }
  }, [detailDevice]);
  const cancelHandler = () => {
    onCancel();
    deviceForm.resetFields();
  };
  const submitHandler = (formValue: DeviceModel) => {
    console.log(formValue);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'DEVICE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={500}
    >
      <>
        <Form
          form={deviceForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          disabled={
            actionModal === ACTION_TYPE.VIEW_DETAIL ||
            !!detailDeviceData.current?.isUsed
          }
        >
          {!!detailDeviceData.current?.isUsed && (
            <Row gutter={32}>
              <Col className={styles.notice} span={24}>
                <p>
                  * This device is currently in use. You can't edit the
                  information.
                </p>
              </Col>
            </Row>
          )}
          <Row gutter={32}>
            <Col span={actionModal === ACTION_TYPE.CREATE ? 24 : 18}>
              <SelectCustomSearch
                url={`${DEVICE.service}-${DEVICE.model.masterData}`}
                name="deviceTypeId"
                label="Device Type"
                dataName="items"
                apiName="device-type-master-data"
                placeholder="Choose device type"
                rules={[{ required: true }]}
                allowClear
              />
            </Col>
            {actionModal !== ACTION_TYPE.CREATE && (
              <Col span={6}>
                <Form.Item label={'Status'}>
                  <BasicTag
                    statusColor={
                      detailDeviceData.current?.isUsed
                        ? STATUS_COLORS.WARING
                        : STATUS_COLORS.SUCCESS
                    }
                    text={
                      detailDeviceData.current?.isUsed ? 'Using' : 'Available'
                    }
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row gutter={32}>
            <Col span="24">
              <BasicInput
                name="deviceCode"
                label="Device Code"
                rules={[{ required: true }]}
                allowClear
                placeholder="Enter device code"
              />
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span="24">
              <BasicInput
                name="deviceName"
                label="Device Name"
                rules={[{ required: true }]}
                allowClear
                placeholder="Enter device name"
              />
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span="24">
              <BasicInput
                name="description"
                label="Description"
                type="textarea"
                rows={3}
                allowClear
                placeholder="Enter device description"
              />
            </Col>
          </Row>
          {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
            <div className={styles['modal__footer']}>
              {(actionModal === ACTION_TYPE.CREATE ||
                actionModal === ACTION_TYPE.EDIT) && (
                <BasicButton
                  title="Cancel"
                  type="outline"
                  onClick={cancelHandler}
                />
              )}
              <>
                {actionModal === ACTION_TYPE.CREATE && (
                  <BasicButton
                    title="Add"
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
              </>
            </div>
          )}
        </Form>
        {actionModal === ACTION_TYPE.VIEW_DETAIL && (
          <div className={styles['modal__footer']}>
            <>
              <BasicButton
                title="Cancel"
                type="outline"
                onClick={cancelHandler}
              />
              <BasicButton
                title="Edit"
                type="filled"
                className={styles['btn--save']}
                onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                disabled={!!detailDeviceData.current?.isUsed}
              />
            </>
          </div>
        )}
      </>
    </CommonModal>
  );
}
