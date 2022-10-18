import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicCheckbox from 'components/BasicCheckbox';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import BasicRadioGroup from 'components/BasicRadioGroup';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import { COMMON_STATUS, MESSAGE_RES, validateMessages } from 'constants/common';
import { ACTION_TYPE, VIEW_LIST_EMPLOYEE_TYPE } from 'constants/enums/common';
import {
  GENDER_LIST,
  POSITION_WORKING,
  RANKING_LIST,
  STATUS_RADIO_LIST,
} from 'constants/fixData';
import { useAddEmployeeModal } from 'hooks/useEmployeeList';
import { EmployeeModel, ResEmployeeModify } from 'models/employee';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import styles from './addEmployee.module.less';
import detailMock from './detailMock.json';

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
  action: ACTION_TYPE;
  employeeId?: number;
  viewType?: string;
}
export default function EmployeeDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  employeeId,
  viewType,
}: IProps) {
  const [employeeForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  // const [detailEmployeeData, setDetailEmployeeData] =
  //   useState<EmployeeListItem>();
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

  // const { data: detailEmployee } = useEmployeeDetail(rollNumber || '');
  const detailEmployee = detailMock;
  useEffect(() => {
    if (detailEmployee && detailEmployee.data) {
      const {
        metadata: { message },
        data: { employee },
      } = detailEmployee;
      if (message === MESSAGE_RES.SUCCESS && employee) {
        // setDetailEmployeeData(employee);
        employeeForm.setFieldsValue(employee);
        employeeForm.setFieldValue('dob', moment(employee.dob));
        employeeForm.setFieldValue('onBoardDate', moment(employee.onBoardDate));
      }
    }
  }, [detailEmployee]);

  const submitHandler = (formValues: EmployeeModel) => {
    console.log(1111, formValues);
    createEmployee(formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'EMPLOYEE INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={1200}
    >
      <>
        <Form
          form={employeeForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
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
                    placeholder="Enter Citizen Identification"
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
                    name="address"
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
                    name="companyEmail"
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
                    name="onBoardDate"
                    label="Onboard Date"
                    rules={[{ required: true }]}
                  />
                </Col>
              </Row>
              <Row gutter={32}>
                <Col span={8}>
                  <BasicCheckbox
                    label="Role"
                    name="isManager"
                    value="Manager"
                  />
                </Col>
                <Col span={8}>
                  <BasicRadioGroup
                    label="Status"
                    name="isActive"
                    initialValue={COMMON_STATUS.TRUE}
                    listRadio={STATUS_RADIO_LIST}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <div className={styles['modal__footer']}>
            {(actionModal === ACTION_TYPE.CREATE ||
              actionModal === ACTION_TYPE.EDIT) && (
              <BasicButton
                title="Cancel"
                type="outline"
                className={styles['btn--cancel']}
                onClick={cancelHandler}
              />
            )}
            {viewType === VIEW_LIST_EMPLOYEE_TYPE.ALL && (
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
            )}
          </div>
        </Form>
        <div className={styles['modal__footer']}>
          {actionModal === ACTION_TYPE.VIEW_DETAIL && (
            <>
              <BasicButton
                title="Cancel"
                type="outline"
                className={styles['btn--cancel']}
                onClick={cancelHandler}
              />
              {viewType === VIEW_LIST_EMPLOYEE_TYPE.ALL && (
                <BasicButton
                  title="Edit"
                  type="filled"
                  className={styles['btn--save']}
                  onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                />
              )}
            </>
          )}
        </div>
      </>
    </CommonModal>
  );
}
