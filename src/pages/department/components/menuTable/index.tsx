import { Popconfirm, Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MENU_OPTION_KEY } from 'constants/enums/common';
import { DepartmentModel } from 'models/department';
interface IProps {
  record: DepartmentModel;
  onClickMenu: (
    itemSelected: DepartmentModel,
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
      {!!record?.isAllowDelete && (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() =>
            onClickMenu && onClickMenu(record, MENU_OPTION_KEY.DELETE)
          }
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
    </div>
  );
}
