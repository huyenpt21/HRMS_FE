import { notification, Tooltip } from 'antd';
import NotifyPopup from 'components/NotifyPopup';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import {
  ACTION_TYPE,
  DEVICE_MENU,
  MENU_OPTION_KEY,
} from 'constants/enums/common';
import { DEVICE } from 'constants/services';
import { useDeleteDevice, useReturnDevice } from 'hooks/useDevice';
import { ResDepartmentModify } from 'models/department';
import { DeviceModel, ResDeviceModify } from 'models/device';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
interface IProps {
  record: DeviceModel;
  menuType: DEVICE_MENU;
  setIsShowDetailModal?: Dispatch<SetStateAction<any>>;
  deviceRequestIdRef?: MutableRefObject<number | undefined>;
  deviceIdRef?: MutableRefObject<number | undefined>;
  modalAction?: MutableRefObject<number | undefined>;
  stateQuery?: DeviceModel;
}
export default function DeviceMenuTable({
  record,
  menuType,
  setIsShowDetailModal,
  deviceRequestIdRef,
  deviceIdRef,
  modalAction,
  stateQuery,
}: IProps) {
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
  const [isShowConfirmReturn, setIsShowConfirmReturn] = useState(false);
  const { mutate: deviceDelete, isLoading: loadingDeleteDevice } =
    useDeleteDevice(
      {
        onSuccess: (response: ResDepartmentModify) => {
          const {
            metadata: { message },
          } = response;
          if (message === MESSAGE_RES.SUCCESS) {
            notification.success({
              message: 'Delete device successfully',
            });
          }
        },
        onError: (response: ResDepartmentModify) => {
          const {
            metadata: { message },
          } = response;
          if (message) {
            notification.error({
              message: message,
            });
          }
        },
      },
      `${DEVICE.model.itSupport}/${DEVICE.service}`,
    );
  const { mutate: returnDevice } = useReturnDevice({
    onSuccess: (response: ResDeviceModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Return device successfully' });
      }
    },
    onError: (response: ResDeviceModify) => {
      const {
        metadata: { message },
      } = response;
      if (message) {
        notification.error({
          message: message,
        });
      }
    },
  });

  const menuActionHandler = (record: DeviceModel, action: MENU_OPTION_KEY) => {
    switch (action) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal && setIsShowDetailModal(true);
        if (deviceIdRef) deviceIdRef.current = record?.id;
        if (modalAction) modalAction.current = ACTION_TYPE.EDIT;
        break;
      }
      case MENU_OPTION_KEY.DELETE: {
        stateQuery &&
          deviceDelete({ uid: record?.id, currentFilter: stateQuery });
      }
    }
  };

  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {menuType === DEVICE_MENU.DEVICE_MANAGEMENT && (
        <>
          <Tooltip title="Edit" placement="left">
            <span
              onClick={() => menuActionHandler(record, MENU_OPTION_KEY.EDIT)}
              className="cursor-pointer"
            >
              <SvgIcon icon="edit-border" />
            </span>
          </Tooltip>
          {!record?.isUsed && (
            <Tooltip title="Delete" placement="right">
              <span
                className="cursor-pointer"
                onClick={() => setIsShowConfirmDelete(true)}
              >
                <SvgIcon icon="close-circle" />
              </span>
            </Tooltip>
          )}
        </>
      )}
      {menuType === DEVICE_MENU.MY_BORROW_DEVICE_HISTORY && (
        <Tooltip title="Return">
          <span
            className="cursor-pointer"
            onClick={() => setIsShowConfirmReturn(true)}
          >
            <SvgIcon icon="return" size={28} />
          </span>
        </Tooltip>
      )}
      {menuType === DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST && (
        <Tooltip title="Assign device">
          <span
            onClick={() => {
              setIsShowDetailModal && setIsShowDetailModal(true);
              if (deviceRequestIdRef) {
                deviceRequestIdRef.current = record?.id;
              }
            }}
            className="cursor-pointer"
          >
            <SvgIcon icon="tag" />
          </span>
        </Tooltip>
      )}
      {isShowConfirmDelete && (
        <NotifyPopup
          title="Are you sure to delete this device?"
          message="This action cannot be reverse"
          onCancel={() => setIsShowConfirmDelete(false)}
          onConfirm={() => {
            menuActionHandler(record, MENU_OPTION_KEY.DELETE);
          }}
          visible={isShowConfirmDelete}
          isLoading={loadingDeleteDevice}
        />
      )}
      {isShowConfirmReturn && (
        <NotifyPopup
          title="Are you sure to return this device?"
          message="This action cannot be reverse"
          onCancel={() => setIsShowConfirmReturn(false)}
          onConfirm={() => {
            returnDevice(record?.id);
          }}
          visible={isShowConfirmReturn}
          isLoading={loadingDeleteDevice}
        />
      )}
    </div>
  );
}
