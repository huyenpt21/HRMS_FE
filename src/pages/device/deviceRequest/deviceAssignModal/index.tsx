import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import CommonModal from 'components/CommonModal';
import SelectCustomSearch from 'components/SelectCustomSearch';
import { MESSAGE_RES, validateMessages } from 'constants/common';
import { DEVICE, REQUEST } from 'constants/services';
import {
  useAddRequestModal,
  useCheckRemainDevice,
  useRequestDetail,
} from 'hooks/useRequestList';
import { DeviceModel } from 'models/device';
import { ResRequestModify } from 'models/request';
import FixDataHeaderRequest from 'pages/requests/components/fixDataHeaderRequest';
import { useEffect, useState } from 'react';
import styles from './assignDeviceModal.module.less';
// import detailMock from './detailMock.json';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList: () => void;
  requestIdRef?: number;
}
export default function DeviceAssignModal({
  isVisible,
  onCancel,
  refetchList,
  requestIdRef,
}: IProps) {
  const [assignDeviceForm] = Form.useForm();
  const [assignData, setAssignData] = useState<DeviceModel>();
  const { data: detailRequest } = useRequestDetail(requestIdRef || 0);
  const { mutate: checkRemainDivce } = useCheckRemainDevice({
    onSuccess: () => {},
    onError: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({
        message: message,
      });
    },
  });
  const { mutate: assignDevice, isLoading } = useAddRequestModal(
    {
      onSuccess: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;

        if (message === 'Success') {
          notification.success({
            message: 'Assign device successfully',
          });
          refetchList();
          cancelHandler();
        }
      },
      onError: (response: ResRequestModify) => {
        const {
          metadata: { message },
        } = response;
        notification.error({
          message: message,
        });
      },
    },
    `${REQUEST.model.itSupport}/${REQUEST.model.itSupport}/${REQUEST.model.assign}`,
  );

  useEffect(() => {
    if (detailRequest && detailRequest?.data) {
      const {
        metadata: { message },
        data: { item },
      } = detailRequest;
      if (message === MESSAGE_RES.SUCCESS && item) {
        assignDeviceForm.setFieldsValue(item);
        setAssignData(item);
        checkRemainDivce(item?.deviceTypeId);
      }
    }
  }, [detailRequest]);

  const cancelHandler = () => {
    onCancel();
    assignDeviceForm.resetFields();
  };
  const submitHandler = (formValues: DeviceModel) => {
    delete formValues.deviceTypeId;
    formValues.requestId = requestIdRef;
    formValues.deviceId = requestIdRef;
    assignDevice(formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'ASSIGN DEVICE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={850}
    >
      <>
        <Form
          form={assignDeviceForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          initialValues={{ listPosition: [''] }}
        >
          <FixDataHeaderRequest requestData={assignData} />
          <Row gutter={32}>
            <Col span="12">
              <SelectCustomSearch
                url={`${DEVICE.model.deviceType}-${DEVICE.model.masterData}`}
                dataName="items"
                apiName="device-type-master-data"
                label="Device Type"
                placeholder="Cannot find device type"
                name="deviceTypeId"
                disabled={true}
              />
            </Col>
            <Col span="12">
              <SelectCustomSearch
                url={`${DEVICE.model.deviceName}-${DEVICE.model.masterData}`}
                dataName="items"
                apiName="device-name-master-data"
                label="Device Name"
                rules={[{ required: true }]}
                placeholder="Choose device name"
                name="deviceId"
                allowClear
                payload={{ deviceTypeId: assignData?.deviceTypeId }}
                isCallApi={!!assignData?.deviceTypeId}
              />
            </Col>
          </Row>
          <div className={styles['modal__footer']}>
            <BasicButton
              title="Cancel"
              type="outline"
              className={styles['btn--cancel']}
              onClick={cancelHandler}
            />
            <BasicButton
              title="Assign"
              type="filled"
              className={styles['btn--save']}
              htmlType={'submit'}
              loading={isLoading}
            />
          </div>
        </Form>
      </>
    </CommonModal>
  );
}
