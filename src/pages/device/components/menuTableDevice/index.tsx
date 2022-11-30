import { Popconfirm, Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { DEVICE_MENU, MENU_OPTION_KEY } from 'constants/enums/common';
import { DeviceModel } from 'models/device';
interface IProps {
  record: DeviceModel;
  onClickMenu: (itemSelected: DeviceModel, actionType: MENU_OPTION_KEY) => void;
  menuType: DEVICE_MENU;
}
export default function DeviceMenuTable({
  record,
  onClickMenu,
  menuType,
}: IProps) {
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {menuType === DEVICE_MENU.DEVICE_MANAGEMENT && (
        <>
          <Tooltip title="Edit">
            <span
              onClick={() => onClickMenu(record, MENU_OPTION_KEY.EDIT)}
              className="cursor-pointer"
            >
              <SvgIcon icon="edit-border" />
            </span>
          </Tooltip>
          {!record.isUsed && (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => onClickMenu(record, MENU_OPTION_KEY.DELETE)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete" placement="right">
                <span className="cursor-pointer">
                  <SvgIcon icon="close-circle" />
                </span>
              </Tooltip>
            </Popconfirm>
          )}
        </>
      )}
      {menuType === DEVICE_MENU.MY_BORROW_DEVICE_HISTORY && (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => onClickMenu(record, MENU_OPTION_KEY.EDIT)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Return">
            <span className="cursor-pointer">
              <SvgIcon icon="return" size={28} />
            </span>
          </Tooltip>
        </Popconfirm>
      )}
      {menuType === DEVICE_MENU.ALL_BORROW_DEVICE_REQUEST && (
        <Tooltip title="Assign device">
          <span
            // onClick={() => {
            //   if (requestIdRef) requestIdRef.current = record.id;
            //   if (modalAction) modalAction.current = ACTION_TYPE.ASSIGN;
            //   setIsShowDetailModal && setIsShowDetailModal(true);
            // }}
            className="cursor-pointer"
          >
            <SvgIcon icon="tag" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
