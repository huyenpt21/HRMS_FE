import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MENU_OPTION_KEY, MENU_TYPE } from 'constants/enums/common';
import { DeviceModel } from 'models/device';
interface IProps {
  record: DeviceModel;
  onClickMenu: (itemSelected: DeviceModel, actionType: MENU_OPTION_KEY) => void;
  menuType: MENU_TYPE;
}
export default function MenuTableDevice({
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
      {menuType === MENU_TYPE.ALL && (
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
            <Tooltip title="Delete">
              <span
                onClick={() => onClickMenu(record, MENU_OPTION_KEY.DELETE)}
                className="cursor-pointer"
              >
                <SvgIcon icon="close-circle" />
              </span>
            </Tooltip>
          )}
        </>
      )}
      {menuType === MENU_TYPE.MINE && (
        <Tooltip title="Return">
          <span
            onClick={() => onClickMenu(record, MENU_OPTION_KEY.EDIT)}
            className="cursor-pointer"
          >
            <SvgIcon icon="return" size={28} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
