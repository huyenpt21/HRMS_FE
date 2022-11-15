import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES, validateMessages } from 'constants/common';
import { useAddDeviceTypeModal } from 'hooks/useDeviceType';
import { DeviceTypeModel, ResDeviceTypeModify } from 'models/device';
import styles from './detailDepartment.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
}
export default function DeviceTypeDetailModal({ isVisible, onCancel }: IProps) {
  const [deviceTypeForm] = Form.useForm();

  const { mutate: createDeviceType } = useAddDeviceTypeModal({
    onSuccess: (response: ResDeviceTypeModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Create deviceType successfully' });
      }
    },
    onError: (response: ResDeviceTypeModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });

  const cancelHandler = () => {
    onCancel();
    deviceTypeForm.resetFields();
  };

  const submitHandler = (formValues: DeviceTypeModel) => {
    createDeviceType(formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'DEVICE TYPE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={500}
    >
      <>
        <Form
          form={deviceTypeForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          initialValues={{ deviceTypeName: [''] }}
        >
          <Col>
            <h4>Add new device type name</h4>
          </Col>

          <Form.List name="deviceTypeName">
            {(fields, { add, remove }, { errors }) => {
              if (fields.length === 0) {
                add();
              }
              return (
                <>
                  {fields.map(({ key, name, ...restFields }) => (
                    <Row key={key} className={styles.position__container}>
                      <Col span={22}>
                        <BasicInput
                          {...restFields}
                          key={key}
                          name={[name]}
                          className={styles.input}
                          allowClear
                          placeholder="Enter device type name"
                        />
                      </Col>
                      {fields.length > 1 && (
                        <span
                          onClick={() => remove(name)}
                          className={styles['icon--delete']}
                        >
                          <SvgIcon
                            icon="approve-waitting"
                            size={24}
                            color="#3c6d73"
                            className={styles['cursor-pointer']}
                          />
                        </span>
                      )}
                    </Row>
                  ))}
                  <div className={styles.btn__add}>
                    <Col span={24}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: '100%' }}
                          icon={<PlusOutlined />}
                        >
                          Add field
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </Col>
                  </div>
                </>
              );
            }}
          </Form.List>
          <div className={styles['modal__footer']}>
            <BasicButton
              title="Cancel"
              type="outline"
              className={styles['btn--cancel']}
              onClick={cancelHandler}
            />
            <>
              <BasicButton
                title="Add"
                type="filled"
                className={styles['btn--save']}
                htmlType={'submit'}
              />
            </>
          </div>
        </Form>
      </>
    </CommonModal>
  );
}
