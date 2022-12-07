import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import SelectCustomSearch from 'components/SelectCustomSearch';
import { validateMessages } from 'constants/common';
import { DEVICE, EMPLOYEE } from 'constants/services';
import { useRegisterSignature } from 'hooks/useSignatureProfile';
import {
  ResSignatureProfileModify,
  SignatureRegister,
} from 'models/signatureProfile';
import styles from './signatureRegister.module.less';
// import detailMock from './detailMock.json';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList: () => void;
  signatureIdRef?: string;
}
export default function SignatureRegisterModal({
  isVisible,
  onCancel,
  refetchList,
  signatureIdRef,
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
        refetchList();
        cancelHandler();
      }
    },
    onError: (response: ResSignatureProfileModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({
        message: message,
      });
    },
  });

  const cancelHandler = () => {
    onCancel();
    registerSignatureForm.resetFields();
  };
  const submitHandler = (formValues: SignatureRegister) => {
    registerSignature(formValues);
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
                label="Signature Profile"
                placeholder="Cannot find device type"
                name="idSignature"
                disabled={true}
                defaultValue={signatureIdRef}
                initialValueForm={signatureIdRef}
              />
            </Col>
            <Col span="12">
              <SelectCustomSearch
                url={`${EMPLOYEE.service}/${DEVICE.model.masterData}`}
                dataName="items"
                apiName="employe-list-all-master-data"
                label="Employe"
                placeholder="Choose employee"
                name="personId"
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
