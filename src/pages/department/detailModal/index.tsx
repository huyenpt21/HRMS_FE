import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicInput from 'components/BasicInput';
import CommonModal from 'components/CommonModal';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES, validateMessages } from 'constants/common';
import { ACTION_TYPE } from 'constants/enums/common';
import {
  useAddDepartmentModal,
  useDepartmentDetail,
  useUpdateDepartment,
} from 'hooks/useDepartment';
import { DepartmentModel, ResDepartmentModify } from 'models/department';
import { useEffect, useRef, useState } from 'react';
import styles from './detailDepartment.module.less';
import detailMock from './detailMock.json';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
  action: ACTION_TYPE;
  departmentId?: number;
  viewType?: string;
}
export default function DepartmentDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  departmentId,
  viewType,
}: IProps) {
  const [departmentForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);
  const [positionList, setPositionList] = useState<string[] | undefined>([
    'ssssss',
    'aaaaa',
    'bbbbb',
  ]);
  const totalMembers = useRef(0);

  const { data: detailDepartment } = useDepartmentDetail(departmentId);

  const { mutate: createDepartment } = useAddDepartmentModal({
    onSuccess: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Create department successfully' });
      }
    },
    onError: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });

  const { mutate: updateDepartment } = useUpdateDepartment({
    onSuccess: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Update department successfully' });
      }
    },
    onError: (response: ResDepartmentModify) => {
      const {
        metadata: { message },
      } = response;
      notification.error({ message: message });
    },
  });

  useEffect(() => {
    // if (detailDepartment && detailDepartment.data) {
    const {
      metadata: { message },
      data: { item: department },
    } = detailMock;
    if (message === MESSAGE_RES.SUCCESS && department) {
      departmentForm.setFieldsValue(department);
      setPositionList(department?.listPosition);
      totalMembers.current = department?.total;
    }
    // }
  }, [detailDepartment]);

  const cancelHandler = () => {
    onCancel();
    departmentForm.resetFields();
  };

  const submitHandler = (formValues: DepartmentModel) => {
    if (actionModal === ACTION_TYPE.CREATE) {
      createDepartment(formValues);
    }
    if (actionModal === ACTION_TYPE.EDIT) {
      updateDepartment({ uid: departmentId, body: formValues });
    }
  };
  return (
    <CommonModal
      open={isVisible}
      title={'DEPARTMENT INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={500}
    >
      <>
        <Form
          form={departmentForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
          initialValues={{ listPosition: [''] }}
        >
          <Col span={24}>
            <BasicInput
              label="Department name"
              name="departmentName"
              rules={[{ required: true }]}
              placeholder="Enter department name"
              allowClear
            />
          </Col>
          <Col>
            <h4 className={styles.mb_24}>
              Total members: {totalMembers.current}
            </h4>
          </Col>
          <Col>
            <h4>Position in department</h4>
          </Col>

          {actionModal !== ACTION_TYPE.VIEW_DETAIL && (
            <Form.List name="listPosition">
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
                            placeholder="Enter position name"
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
          )}
          {actionModal === ACTION_TYPE.VIEW_DETAIL && (
            <ul className={styles.position__list}>
              {positionList &&
                positionList.map((el: string, index: number) => (
                  <li key={index}>{el}</li>
                ))}
            </ul>
          )}
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
                className={styles['btn--cancel']}
                onClick={cancelHandler}
              />
              <BasicButton
                title="Edit"
                type="filled"
                className={styles['btn--save']}
                onClick={() => setActionModal(ACTION_TYPE.EDIT)}
              />
            </>
          </div>
        )}
      </>
    </CommonModal>
  );
}
