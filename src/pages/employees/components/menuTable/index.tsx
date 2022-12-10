import { Popconfirm, Tooltip } from 'antd';
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
      {!record.isActive && (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() =>
            onClickMenu && onClickMenu(record, MENU_OPTION_KEY.ACTIVE)
          }
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Active" placement="left">
            <span className="cursor-pointer">
              <SvgIcon icon="accept-circle" />
            </span>
          </Tooltip>
        </Popconfirm>
      )}
      {!!record.isActive && (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() =>
            onClickMenu && onClickMenu(record, MENU_OPTION_KEY.DEACTIVE)
          }
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Inactivate" placement="left">
            <span className="cursor-pointer">
              <SvgIcon icon="close-circle" />
            </span>
          </Tooltip>
        </Popconfirm>
      )}
      <Tooltip title="Edit" placement="right">
        <span
          onClick={() => onClickMenu(record, MENU_OPTION_KEY.EDIT)}
          className="cursor-pointer"
        >
          <SvgIcon icon="edit-border" />
        </span>
      </Tooltip>
    </div>
  );
}
