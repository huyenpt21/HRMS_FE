import { Col, Form, Row } from 'antd';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import CommonModal from 'components/CommonModal';
import TimeRangePicker from 'components/TimeRangePicker';
import UploadFilePictureWall from 'components/UploadFile';
import { validateMessages } from 'constants/common';
import { ACTION_TYPE } from 'constants/enums/common';
import { RequestListModel } from 'models/request';

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
  // const [actionModal, setActionModal] = useState(action);

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
      width={800}
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
                rows={4}
                placeholder="Enter your reason . . ."
                label="Reason"
                rules={[{ required: true }]}
              />
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <UploadFilePictureWall />
            </Col>
          </Row>
        </Form>
      </>
    </CommonModal>
  );
}
