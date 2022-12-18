import { notification, Tooltip } from 'antd';
import NotifyPopup from 'components/NotifyPopup';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { ACTION_TYPE, MENU_OPTION_KEY } from 'constants/enums/common';
import { useDeleteDepartment } from 'hooks/useDepartment';
import {
  DepartmentListQuery,
  DepartmentModel,
  ResDepartmentModify,
} from 'models/department';
import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
interface IProps {
  record: DepartmentModel;
  setIsShowDetailModal: Dispatch<SetStateAction<boolean>>;
  modalAction: MutableRefObject<ACTION_TYPE>;
  departmentIdRef: MutableRefObject<number | undefined>;
  stateQuery: DepartmentListQuery;
}
export default function MenuTableDepartment({
  record,
  setIsShowDetailModal,
  modalAction,
  departmentIdRef,
  stateQuery,
}: IProps) {
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const { mutate: deleteDepartment, isLoading: loadingDelete } =
    useDeleteDepartment({
      onSuccess: (response: ResDepartmentModify) => {
        const {
          metadata: { message },
        } = response;
        if (message === MESSAGE_RES.SUCCESS) {
          notification.success({ message: 'Delete department successfully' });
        }
        setIsShowConfirm(false);
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
        setIsShowConfirm(false);
      },
    });
  const menuActionHandler = (
    itemSelected: DepartmentModel,
    actionType: MENU_OPTION_KEY,
  ) => {
    switch (actionType) {
      case MENU_OPTION_KEY.EDIT: {
        setIsShowDetailModal(true);
        modalAction.current = ACTION_TYPE.EDIT;
        departmentIdRef.current = itemSelected?.id;
        break;
      }
      case MENU_OPTION_KEY.DELETE: {
        deleteDepartment({ uid: itemSelected.id, currentFilter: stateQuery });
        break;
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
      <Tooltip title="Edit" placement="left">
        <span
          onClick={() => menuActionHandler(record, MENU_OPTION_KEY.EDIT)}
          className="cursor-pointer"
        >
          <SvgIcon icon="edit-border" />
        </span>
      </Tooltip>
      {!!record?.isAllowDelete && (
        <Tooltip title="Delete" placement="right">
          <span
            className="cursor-pointer"
            onClick={() => setIsShowConfirm(true)}
          >
            <SvgIcon icon="close-circle" />
          </span>
        </Tooltip>
      )}
      {isShowConfirm && (
        <NotifyPopup
          title="Are you sure to delete this department?"
          message="This action cannot be reverse"
          onCancel={() => setIsShowConfirm(false)}
          onConfirm={() => menuActionHandler(record, MENU_OPTION_KEY.DELETE)}
          visible={isShowConfirm}
          isLoading={loadingDelete}
        />
      )}
    </div>
  );
}
