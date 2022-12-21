import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import SelectCustomSearch from 'components/SelectCustomSearch';
import { validateMessages } from 'constants/common';
import { EMPLOYEE } from 'constants/services';
import { useRegisterSignature } from 'hooks/useSignatureProfile';
import { EmployeeModel } from 'models/employee';
import {
  ResSignatureProfileModify,
  SignatureRegister,
} from 'models/signatureProfile';
import styles from './signatureRegister.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  employee?: EmployeeModel;
}
export default function SignatureRegisterModal({
  isVisible,
  onCancel,
  employee,
}: IProps) {
  const [registerSignatureForm] = Form.useForm();
  const { mutate: registerSignature, isLoading } = useRegisterSignature({
    onSuccess: (response: ResSignatureProfileModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Register signature successfully',
        });
        cancelHandler();
      }
    },
    onError: (response: ResSignatureProfileModify) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        notification.error({ message: message });
      }
    },
  });

  const cancelHandler = () => {
    onCancel();
    registerSignatureForm.resetFields();
  };
  const submitHandler = (formValues: SignatureRegister) => {
    formValues.personId = employee?.id;
    registerSignature(formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'REGISTER SIGNATURE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={850}
    >
      <>
        <Form
          form={registerSignatureForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          initialValues={{ listPosition: [''] }}
        >
          <Row gutter={32}>
            <Col span="12">
              <BasicInput
                label="Employee"
                placeholder="Can not find this employee"
                name="personId"
                disabled={true}
                defaultValue={`${employee?.fullName} - ${employee?.rollNumber}`}
              />
            </Col>
            <Col span="12">
              <SelectCustomSearch
                url={`${EMPLOYEE.model.signature}/${EMPLOYEE.model.masterData}`}
                dataName="items"
                apiName="register-date-list-master-data"
                label="Register Date"
                placeholder="Choose register date"
                name="registeredDate"
                rules={[{ required: true }]}
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
              title="Register"
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
