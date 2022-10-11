import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicCheckbox from 'components/BasicCheckbox';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import { validateMessages } from 'constants/common';
import { GENDER_LIST, POSITION_WORKING, RANKING_LIST } from 'constants/fixData';
import { useAddEmployeeModal } from 'hooks/useEmployeeList/UseEmployee';
import { EmployeeListItem, ResEmployeeModify } from 'models/allEmployee';
import styles from './addEmployeeModal.module.less';

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
    employeeForm.resetFields();
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
      width={1200}
    >
      <Form
        form={employeeForm}
        layout="vertical"
        requiredMark
        validateMessages={validateMessages()}
        onFinish={submitHandler}
      >
        <Row gutter={36}>
          <Col span={12} className={styles.column}>
            <h2>Personnal Information</h2>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="name"
                  label="Full Name"
                  rules={[{ required: true }]}
                  allowClear
                  placeholder="Enter full name "
                />
              </Col>
              <Col span={12}>
                <BasicDatePicker
                  name="dob"
                  label="Date Of Birth"
                  rules={[{ required: true }]}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicSelect
                  options={GENDER_LIST}
                  name="gender"
                  label="Gender"
                  allowClear
                  placeholder="Enter address"
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={12}>
                <BasicInput
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    { required: true },
                    {
                      pattern: '^[0-9 ]*$',
                      message: 'Please enter a valid phone number',
                    },
                  ]}
                  allowClear
                  placeholder="Enter phone number"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="citizenIdentification"
                  label="Citizen Identification"
                  allowClear
                  rules={[{ required: true }]}
                  placeholder="Enter address"
                />
              </Col>
              <Col span={12}>
                <BasicInput
                  name="individualEmail"
                  label="Individual Email"
                  allowClear
                  rules={[
                    { required: true },
                    {
                      pattern: '[a-z0-9]+@[a-z]+.[a-z]{2,3}',
                      message: 'Please enter a valid email address',
                    },
                  ]}
                  placeholder="Enter address"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <BasicInput
                  label="Address"
                  type="textarea"
                  allowClear
                  placeholder="Enter address"
                  rows={4}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <h2>Working Information</h2>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="rollNumber"
                  label="Roll Number"
                  rules={[{ required: true }]}
                  allowClear
                  placeholder="Enter roll number"
                />
              </Col>
              <Col span={12}>
                <BasicInput
                  name="email"
                  label="Company Email"
                  rules={[
                    { required: true },
                    {
                      pattern: '^[A-Za-z0-9._%+-]+@minswap.com$',
                      message:
                        'Please enter a valid email with correct domain @minswap.com',
                    },
                  ]}
                  allowClear
                  placeholder="nguyenvan@minswap.com"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="manager"
                  label="Manager"
                  allowClear
                  placeholder="Choose manager"
                />
              </Col>
              <Col span={12}>
                <BasicInput
                  name="department"
                  label="Department"
                  rules={[{ required: true }]}
                  allowClear
                  placeholder="Choose department"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicSelect
                  options={POSITION_WORKING}
                  name="position"
                  label="Position"
                  rules={[{ required: true }]}
                  allowClear
                  placeholder="Choose position"
                />
              </Col>
              <Col span={12}>
                <BasicSelect
                  options={RANKING_LIST}
                  name="ranking"
                  label="Ranking"
                  rules={[{ required: true }]}
                  allowClear
                  placeholder="Choose ranking"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicDatePicker
                  name="onboardDate"
                  label="Onboard Date"
                  rules={[{ required: true }]}
                />
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={8}>
                <BasicCheckbox label="Role" name="isManager" value="Manager" />
              </Col>
            </Row>
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
            title="Add"
            type="filled"
            className={styles['btn--save']}
            htmlType={'submit'}
          />
        </div>
      </Form>
    </CommonModal>
  );
}
