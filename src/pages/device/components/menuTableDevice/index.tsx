import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MENU_OPTION_KEY } from 'constants/enums/common';
import { DeviceModel } from 'models/device';
interface IProps {
  record: DeviceModel;
  onClickMenu: (itemSelected: DeviceModel, actionType: MENU_OPTION_KEY) => void;
}
export default function MenuTableDevice({ record, onClickMenu }: IProps) {
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
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
            onClick={() => onClickMenu(record, MENU_OPTION_KEY.DEACTIVE)}
            className="cursor-pointer"
          >
            <SvgIcon icon="close-circle" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
