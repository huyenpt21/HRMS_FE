import { Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicCheckbox from 'components/BasicCheckbox';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import BasicRadioGroup from 'components/BasicRadioGroup';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import SelectCustomSearch from 'components/SelectCustomSearch';
import {
  COMMON_STATUS,
  DATE_TIME,
  MESSAGE_RES,
  validateMessages,
} from 'constants/common';
import { ACTION_TYPE, EMPLOYEE_MENU } from 'constants/enums/common';
import {
  GENDER_LIST,
  RANKING_LIST,
  COMMON_STATUS_LIST,
} from 'constants/fixData';
import {
  DEPARTMENT,
  MANAGER_LIST,
  POSITION_BY_DEPARTMENT,
} from 'constants/services';
import {
  useAddEmployeeModal,
  useEmployeeDetail,
  useUpdateEmployee,
} from 'hooks/useEmployee';
import { EmployeeModel, ResEmployeeModify } from 'models/employee';
import moment from 'moment-timezone';
import { useEffect, useState, useRef } from 'react';
import { getDateFormat } from 'utils/common';
import styles from './addEmployee.module.less';
// import detailMock from './detailMock.json';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
  action: ACTION_TYPE;
  employeeRollNumber?: string;
  viewType?: string;
}
export default function EmployeeDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  employeeRollNumber,
  viewType,
}: IProps) {
  const [employeeForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  const [departmentId, setDepartmentId] = useState<number | undefined>(0);
  const personInforRef = useRef<EmployeeModel>();

  const { data: detailEmployee } = useEmployeeDetail(employeeRollNumber);
  const { mutate: updateEmployee } = useUpdateEmployee({
    onSuccess: (response: ResEmployeeModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Update information successfully',
        });
        cancelHandler();
      }
    },
  });

  const { mutate: createEmployee } = useAddEmployeeModal({
    onSuccess: (response: ResEmployeeModify) => {
      const {
        metadata: { message },
      } = response;

      if (message === 'Success') {
        notification.success({
          message: 'Create employee successfully',
        });
        cancelHandler();
      }
    },
  });
  useEffect(() => {
    if (detailEmployee && detailEmployee.data) {
      const {
        metadata: { message },
        data: { item: employee },
      } = detailEmployee;
      if (message === MESSAGE_RES.SUCCESS && employee) {
        setDepartmentId(employee?.departmentId);
        personInforRef.current = employee;
        employeeForm.setFieldsValue(employee);
        employeeForm.setFieldsValue({
          dateOfBirth: moment(employee.dateOfBirth),
          onBoardDate: moment(employee.onBoardDate),
        });
      }
    }
  }, [detailEmployee]);

  const cancelHandler = () => {
    onCancel();
    employeeForm.resetFields();
  };

  const submitHandler = (formValues: EmployeeModel) => {
    formValues.onBoardDate = getDateFormat(formValues.onBoardDate, DATE_TIME);
    formValues.dateOfBirth = getDateFormat(formValues.dateOfBirth, DATE_TIME);
    formValues.isManager = formValues.isManager ? 1 : 0;

    switch (actionModal) {
      case ACTION_TYPE.CREATE: {
        createEmployee(formValues);
        break;
      }
      case ACTION_TYPE.EDIT: {
        if (employeeRollNumber) {
          updateEmployee({ uid: employeeRollNumber, body: formValues });
          break;
        }
      }
    }
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
            <Col span={11} className={styles.column}>
              <div className={styles.header__title}>Personnal Information</div>
              <Row gutter={12}>
                <Col span={12}>
                  <BasicInput
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, whitespace: true }]}
                    allowClear
                    placeholder="Enter full name "
                  />
                </Col>
                <Col span={12}>
                  <BasicDatePicker
                    name="dateOfBirth"
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
                    placeholder="Choose gender"
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
                        pattern: new RegExp(
                          '^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$',
                        ),
                        message: 'Phone Number is invalid',
                      },
                    ]}
                    allowClear
                    placeholder="Enter phone number"
                    showCount
                  />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <BasicInput
                    name="citizenIdentification"
                    label="Citizen Identification"
                    allowClear
                    rules={[
                      { required: true, whitespace: true },
                      {
                        pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
                        message: 'Expect only 9 or 12 numbers',
                      },
                    ]}
                    placeholder="Enter Citizen Identification"
                    showCount
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
            <Col span={13}>
              <div className={styles.header__title}>Working Information</div>
              {(actionModal === ACTION_TYPE.EDIT ||
                actionModal === ACTION_TYPE.VIEW_DETAIL) && (
                <Row gutter={12} className={styles['infor--header']}>
                  <Col span={12}>
                    <span>Roll Number: </span>
                    <span className={styles['text--bold']}>
                      {personInforRef.current?.rollNumber}
                    </span>
                  </Col>
                  <Col span={12}>
                    <span>Email: </span>
                    <span className={styles['text--bold']}>
                      {personInforRef.current?.email}
                    </span>
                  </Col>
                </Row>
              )}
              <Row gutter={12}>
                <Col span={12}>
                  <BasicInput
                    label="Basic Salary"
                    name="salaryBasic"
                    rules={[
                      { required: true },
                      {
                        pattern: new RegExp('\\d'),
                        message: 'Basic Salary is invalid',
                      },
                    ]}
                    allowClear
                    placeholder="Enter basic salary"
                  />
                </Col>
                <Col span={12}>
                  <BasicInput
                    label="Basic Bonus"
                    name="salaryBonus"
                    rules={[
                      { required: true },
                      {
                        pattern: new RegExp('\\d'),
                        message: 'Basic Bonus is invalid',
                      },
                    ]}
                    allowClear
                    placeholder="Enter bonus salary"
                  />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <SelectCustomSearch
                    url={DEPARTMENT.model.masterData}
                    dataName="items"
                    name="departmentId"
                    label="Department"
                    rules={[{ required: true }]}
                    allowClear
                    placeholder="Choose department"
                    onChangeHandle={(value) => {
                      setDepartmentId(value);
                      employeeForm.setFieldsValue({
                        positionId: undefined,
                        managerId: undefined,
                      });
                    }}
                    apiName="department-master-data"
                  />
                </Col>
                <Col span={12}>
                  <SelectCustomSearch
                    url={`${MANAGER_LIST.service}?departmentId=${departmentId}`}
                    dataName="items"
                    name="managerId"
                    label="Manager"
                    rules={[{ required: true }]}
                    allowClear
                    placeholder="Choose manager"
                    apiName="manager-master-data"
                    isCallApi={false}
                    refetchValue={departmentId}
                    disabled={!departmentId}
                  />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <SelectCustomSearch
                    url={`${POSITION_BY_DEPARTMENT.service}?departmentId=${departmentId}`}
                    dataName="items"
                    name="positionId"
                    label="Position"
                    rules={[{ required: true }]}
                    allowClear
                    placeholder="Choose position"
                    apiName="position-master-data-detail"
                    isCallApi={false}
                    refetchValue={departmentId}
                    disabled={!departmentId}
                  />
                </Col>
                <Col span={12}>
                  <BasicSelect
                    options={RANKING_LIST}
                    name="rankId"
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
                    initialValue={COMMON_STATUS.ACTIVE}
                    listRadio={COMMON_STATUS_LIST}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
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
              {viewType === EMPLOYEE_MENU.ALL && (
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
          )}
        </Form>
        {actionModal === ACTION_TYPE.VIEW_DETAIL && (
          <div className={styles['modal__footer']}>
            <>
              <BasicButton
                title="Cancel"
                type="outline"
                className={styles['btn--cancel']}
                onClick={cancelHandler}
              />
              {viewType === EMPLOYEE_MENU.ALL && (
                <BasicButton
                  title="Edit"
                  type="filled"
                  className={styles['btn--save']}
                  onClick={() => setActionModal(ACTION_TYPE.EDIT)}
                />
              )}
            </>
          </div>
        )}
      </>
    </CommonModal>
  );
}
