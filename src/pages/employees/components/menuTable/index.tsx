import { notification, Tooltip } from 'antd';
import NotifyPopup from 'components/NotifyPopup';
import SvgIcon from 'components/SvgIcon';
import { ACTION_TYPE, MENU_OPTION_KEY } from 'constants/enums/common';
import { EMPLOYEE_CHANGE_STATUS } from 'constants/services';
import { useUpdateEmployee } from 'hooks/useEmployee';
import { EmployeeModel, ResEmployeeModify } from 'models/employee';
import { useState, Dispatch, SetStateAction, MutableRefObject } from 'react';
import SignatureRegisterModal from '../modalRegister';
interface IProps {
  record: EmployeeModel;
  refetchList: () => void;
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  employeeRollNumberRef: MutableRefObject<string | undefined>;
}
export default function MenuAction({
  record,
  refetchList,
  setIsShowDetailModal,
  modalAction,
  employeeRollNumberRef,
}: IProps) {
  const [isShowConfirmActive, setIsShowConfirmActive] = useState(false);
  const [isShowConfirmInActive, setIsShowConfirmInActive] = useState(false);
  const [isShowRegisterModal, setIsShowRegisterModal] = useState(false);
  const { mutate: updateEmployee, isLoading: loadingChangeStatus } =
    useUpdateEmployee(
      {
        onSuccess: (response: ResEmployeeModify) => {
          const {
            metadata: { message },
          } = response;

          if (message === 'Success') {
            notification.success({
              message: 'Update status successfully',
            });
            refetchList();
            setIsShowConfirmActive(false);
            setIsShowConfirmInActive(false);
          }
        },
      },
      EMPLOYEE_CHANGE_STATUS.service,
    );

  const menuActionHandler = (
    itemSelected: EmployeeModel,
    actionType: MENU_OPTION_KEY,
  ) => {
    switch (actionType) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal(true);
        modalAction.current = ACTION_TYPE.EDIT;
        employeeRollNumberRef.current = itemSelected?.rollNumber;
        break;
      }
      case MENU_OPTION_KEY.ACTIVE: {
        updateEmployee({
          uid: itemSelected?.rollNumber,
          body: { id: itemSelected.id, isActive: 1 },
        });
        break;
      }
      case MENU_OPTION_KEY.DEACTIVE: {
        updateEmployee({
          uid: itemSelected?.rollNumber,
          body: { id: itemSelected.id, isActive: 0 },
        });
        break;
      }
    }
  };
  const cancelModalHandler = () => {
    setIsShowRegisterModal(false);
  };
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip title="Register signature" placement="left">
        <span
          onClick={() => {
            setIsShowRegisterModal(true);
            // registeredDateRef.current = record?.registeredDate;
          }}
          className="cursor-pointer"
        >
          <SvgIcon icon="tag" />
        </span>
      </Tooltip>
      {!record.isActive && (
        <Tooltip title="Active" placement="top">
          <span
            className="cursor-pointer"
            onClick={() => setIsShowConfirmActive(true)}
          >
            <SvgIcon icon="accept-circle" />
          </span>
        </Tooltip>
      )}
      {!!record.isActive && (
        <Tooltip title="Inactivate" placement="top">
          <span
            className="cursor-pointer"
            onClick={() => setIsShowConfirmInActive(true)}
          >
            <SvgIcon icon="close-circle" />
          </span>
        </Tooltip>
      )}
      <Tooltip title="Edit" placement="right">
        <span
          onClick={() => menuActionHandler(record, MENU_OPTION_KEY.EDIT)}
          className="cursor-pointer"
        >
          <SvgIcon icon="edit-border" />
        </span>
      </Tooltip>
      {isShowConfirmActive && (
        <NotifyPopup
          title="Are you sure to active this person?"
          onCancel={() => setIsShowConfirmActive(false)}
          onConfirm={() => {
            menuActionHandler(record, MENU_OPTION_KEY.ACTIVE);
          }}
          visible={isShowConfirmActive}
          isLoading={loadingChangeStatus}
        />
      )}
      {isShowConfirmInActive && (
        <NotifyPopup
          title="Are you sure to inactive this person?"
          onCancel={() => setIsShowConfirmInActive(false)}
          onConfirm={() => {
            menuActionHandler(record, MENU_OPTION_KEY.DEACTIVE);
          }}
          visible={isShowConfirmInActive}
          isLoading={loadingChangeStatus}
        />
      )}
      {isShowRegisterModal && (
        <SignatureRegisterModal
          isVisible={isShowRegisterModal}
          onCancel={cancelModalHandler}
          employee={record}
        />
      )}
    </div>
  );
}
