import { CloseOutlined } from '@ant-design/icons';
import { notification, Tooltip, Typography } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { useUpdateDeviceType } from 'hooks/useDeviceType';
import { DeviceTypeModel, ResDeviceTypeModify } from 'models/device';
import { EmployeeModel } from 'models/employee';
import { Dispatch, SetStateAction } from 'react';
interface IProps {
  record: EmployeeModel;
  form: FormInstance;
  editingKey: number;
  setEditingKey: Dispatch<SetStateAction<number>>;
}
export default function MenuTableDeviceType({
  record,
  form,
  editingKey,
  setEditingKey,
}: IProps) {
  const { mutate: updateDeviceType } = useUpdateDeviceType({
    onSuccess: (res: ResDeviceTypeModify) => {
      const {
        metadata: { message },
      } = res;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({
          message: 'UPdate device type name successfully',
        });
      }
    },
  });
  const handleEdit = (record: DeviceTypeModel & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const handleSave = async (id: number) => {
    try {
      const row = (await form.validateFields()) as DeviceTypeModel;
      updateDeviceType({
        uid: id,
        body: { id: id, deviceTypeName: row.deviceTypeName },
      });
      setEditingKey(-1);
    } catch (error) {}
  };
  return (
    <div className="menu-action">
      {record.id === editingKey && (
        <>
          <Tooltip title="Save">
            <span
              onClick={async () => {
                handleSave(record.id);
              }}
              className="cursor-pointer"
            >
              <SvgIcon icon="check-square" />
            </span>
          </Tooltip>
          <Tooltip title="Cancel">
            <span
              onClick={() => {
                setEditingKey(-1);
              }}
              className="cursor-pointer"
              style={{ textAlign: 'center' }}
            >
              <CloseOutlined />
            </span>
          </Tooltip>
        </>
      )}
      {record.id !== editingKey && (
        <>
          <Tooltip title="Edit">
            <Typography.Link
              disabled={editingKey !== -1}
              onClick={() => handleEdit(record)}
            >
              <SvgIcon icon="edit-border" />
            </Typography.Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Typography.Link onClick={() => {}} disabled={editingKey !== -1}>
              <SvgIcon icon="close-circle" />
            </Typography.Link>
          </Tooltip>
        </>
      )}
    </div>
  );
}
