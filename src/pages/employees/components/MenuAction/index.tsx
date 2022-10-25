import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MENU_OPTION_KEY } from 'constants/enums/common';
import { EmployeeModel } from 'models/employee';
interface IProps {
  record: EmployeeModel;
  onClickMenu: (
    itemSelected: EmployeeModel,
    actionType: MENU_OPTION_KEY,
  ) => void;
}
export default function MenuAction({ record, onClickMenu }: IProps) {
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
      {!!record.isActive && (
        <Tooltip title="Deactive">
          <span
            onClick={() => onClickMenu(record, MENU_OPTION_KEY.DEACTIVE)}
            className="cursor-pointer"
          >
            <SvgIcon icon="close-circle" />
          </span>
        </Tooltip>
      )}
      {!record.isActive && (
        <Tooltip title="Active">
          <span
            onClick={() => onClickMenu(record, MENU_OPTION_KEY.ACTIVE)}
            className="cursor-pointer"
          >
            <SvgIcon icon="accept-circle" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
