import { CloseOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Tooltip, Typography } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { DEVICE } from 'constants/services';
import { useDeleteDevice, useUpdateDevice } from 'hooks/useDevice';
import { DeviceListQuery, DeviceModel, ResDeviceModify } from 'models/device';
import { EmployeeModel } from 'models/employee';
import { Dispatch, SetStateAction } from 'react';
interface IProps {
  record: EmployeeModel;
  form: FormInstance;
  editingKey: number;
  setEditingKey: Dispatch<SetStateAction<number>>;
  stateQuery: DeviceListQuery;
  refetch: () => {};
}
export default function MenuTableDeviceType({
  record,
  form,
  editingKey,
  setEditingKey,
  stateQuery,
  refetch,
}: IProps) {
  const { mutate: updateDeviceType } = useUpdateDevice(
    {
      onSuccess: (res: ResDeviceModify) => {
        const {
          metadata: { message },
        } = res;
        if (message === MESSAGE_RES.SUCCESS) {
          notification.success({
            message: 'Update device type name successfully',
          });
          refetch();
        }
      },
      onError: (res: ResDeviceModify) => {
        const {
          metadata: { message },
        } = res;
        notification.error({ message: message });
      },
    },
    `${DEVICE.model.itSupport}/${DEVICE.model.deviceType}`,
  );
  const { mutate: deleteDeviceType } = useDeleteDevice(
    {
      onSuccess: (res: ResDeviceModify) => {
        const {
          metadata: { message },
        } = res;
        if (message === MESSAGE_RES.SUCCESS) {
          notification.success({ message: 'Delete device type successfully' });
        }
      },
      onError: (res: ResDeviceModify) => {
        const {
          metadata: { message },
        } = res;
        notification.error({ message: message });
        refetch();
      },
    },
    `${DEVICE.model.itSupport}/${DEVICE.model.deviceType}`,
  );
  const handleEdit = (record: DeviceModel & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };
  const handleSave = async (id: number) => {
    try {
      const row = (await form.validateFields()) as DeviceModel;
      updateDeviceType({
        uid: id,
        body: { id: id, deviceTypeName: row.deviceTypeName },
      });
      setEditingKey(-1);
    } catch (error) {}
  };
  return (
    <>
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
            <Tooltip title="Edit" placement="left">
              <Typography.Link
                disabled={editingKey !== -1}
                onClick={() => handleEdit(record)}
              >
                <SvgIcon icon="edit-border" />
              </Typography.Link>
            </Tooltip>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() =>
                deleteDeviceType({ uid: record.id, currentFilter: stateQuery })
              }
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete" placement="right">
                <Typography.Link disabled={editingKey !== -1}>
                  <SvgIcon icon="close-circle" />
                </Typography.Link>
              </Tooltip>
            </Popconfirm>
          </>
        )}
      </div>
    </>
  );
}
