import { Form } from 'antd';
import BasicButton from 'components/BasicButton';
import CommonModal from 'components/CommonModal';
import { validateMessages } from 'constants/common';
import React from 'react';
import styles from './detailModalDevice.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
}
export default function DetailModalDevice({ isVisible, onCancel }: IProps) {
  const [deviceForm] = Form.useForm();
  const cancelHandler = () => {
    onCancel();
    deviceForm.resetFields();
  };
  return (
    <CommonModal
      open={isVisible}
      title={'DEVICE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={500}
    >
      <Form
        form={deviceForm}
        layout="vertical"
        requiredMark
        validateMessages={validateMessages()}
        // onFinish={submitHandler}
      >
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
    </CommonModal>
  );
}
