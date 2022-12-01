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
export default function MenuTableDepartment({ record, onClickMenu }: IProps) {
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip title="Edit" placement="left">
        <span
          onClick={() => onClickMenu(record, MENU_OPTION_KEY.EDIT)}
          className="cursor-pointer"
        >
          <SvgIcon icon="edit-border" />
        </span>
      </Tooltip>
      <Tooltip title="Delete" placement="right">
        <span
          onClick={() => onClickMenu(record, MENU_OPTION_KEY.DELETE)}
          className="cursor-pointer"
        >
          <SvgIcon icon="close-circle" />
        </span>
      </Tooltip>
    </div>
  );
}
