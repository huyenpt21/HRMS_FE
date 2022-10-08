import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import { validateMessages } from 'constants/common';
import { EmployeeListItem, ResEmployeeModify } from 'models/allEmployee';
import styles from './AddEmployeeModal.module.less';
import { useAddEmployeeModal } from 'hooks/useEmployeeList/UseEmployee';

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
}
export default function AddEmployeeModal({
  isVisible,
  onCancel,
  refetchList,
}: IProps) {
  const [employeeForm] = Form.useForm();
  const cancelHandler = () => {
    onCancel();
  };

  const { mutate: createEmployee } = useAddEmployeeModal({
    onSuccess: (response: ResEmployeeModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Create employee successfully',
        });
        // refetchList();
      }
    },
  });

  const submitHandler = (formValues: EmployeeListItem) => {
    console.log(1111, formValues);
    createEmployee(formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'ADD EMPLOYEE'}
      onCancel={cancelHandler}
      footer={false}
      width={800}
    >
      <Form
        form={employeeForm}
        layout="vertical"
        requiredMark
        validateMessages={validateMessages()}
        onFinish={submitHandler}
      >
        <Row gutter={32}>
          <Col span={12}>
            <BasicInput
              name="name"
              label="Name"
              rules={[{ required: true }]}
              allowClear
            />
          </Col>
          <Col span={12}>
            <BasicInput
              name="rollNumber"
              label="Roll number"
              rules={[{ required: true }]}
              allowClear
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
            title="Create"
            type="filled"
            className={styles['btn--save']}
            htmlType={'submit'}
          />
        </div>
      </Form>
    </CommonModal>
  );
}
