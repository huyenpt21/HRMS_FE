import { notification, Tooltip } from 'antd';
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
      )}
      {record.id !== editingKey && (
        <>
          <Tooltip title="Edit">
            <span
              onClick={() => handleEdit(record)}
              className="cursor-pointer"
              style={{ border: 0 }}
            >
              <SvgIcon icon="edit-border" />
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span onClick={() => {}} className="cursor-pointer">
              <SvgIcon icon="close-circle" />
            </span>
          </Tooltip>
        </>
      )}
    </div>
  );
}
