import { Col, Form, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import TimeRangePicker from 'components/TimeRangePicker';
import UploadFilePictureWall from 'components/UploadFile';
import { validateMessages } from 'constants/common';
import { ACTION_TYPE } from 'constants/enums/common';
import { RequestListModel } from 'models/request';
import { useState } from 'react';
import styles from './requestDetailModal.module.less';

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  refetchList?: () => void;
  action: ACTION_TYPE;
  requestId?: string;
}
export default function RequestDetailModal({
  isVisible,
  onCancel,
  refetchList,
  action,
  requestId,
}: IProps) {
  const [requestForm] = Form.useForm();
  const [actionModal, setActionModal] = useState(action);

  const cancelHandler = () => {
    onCancel();
    requestForm.resetFields();
  };
  const submitHandler = (formValues: RequestListModel) => {
    console.log(1111, formValues);
  };
  return (
    <CommonModal
      open={isVisible}
      title={'REQUEST INFORMATION'}
      onCancel={cancelHandler}
      footer={false}
      width={850}
    >
      <>
        <Form
          form={requestForm}
          layout="vertical"
          requiredMark
          validateMessages={validateMessages()}
          onFinish={submitHandler}
          // disabled={actionModal === ACTION_TYPE.VIEW_DETAIL}
        >
          <Row gutter={20}>
            <Col span="12">
              <BasicSelect
                options={[]}
                label="Request Type"
                rules={[{ required: true }]}
                placeholder="Choose request type"
                name="requestType"
              />
            </Col>
            <Col span="8">
              <BasicInput
                label="Your Approver"
                placeholder="You don't have approver"
                name="approver"
                disabled
                defaultValue="Nguyen Van B"
              />
            </Col>
            <Col span="4">
              <BasicInput
                label="Remaining Time"
                name="reaminingTimeOff"
                disabled
                defaultValue="2 / 44 hours"
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span="12">
              <BasicDateRangePicker
                name="date"
                label="Applicable Date"
                rules={[{ required: true }]}
                placeholder={['From', 'To']}
              />
            </Col>
            <Col span="12">
              <TimeRangePicker
                label="Applicable Time"
                rules={[{ required: true }]}
                placeholder={['From', 'To']}
                name="time"
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <BasicInput
                type="textarea"
                rows={3}
                placeholder="Enter your reason . . ."
                label="Reason"
                rules={[{ required: true }]}
                name="reason"
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                label="Evidence"
                rules={[{ required: true }]}
                className={styles.form__upload}
                name="evidence"
              >
                <UploadFilePictureWall />
              </Form.Item>
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
              <BasicButton
                title="Edit"
                type="filled"
                className={styles['btn--save']}
                onClick={() => setActionModal(ACTION_TYPE.EDIT)}
              />
            </>
          )}
        </div>
      </>
    </CommonModal>
  );
}
