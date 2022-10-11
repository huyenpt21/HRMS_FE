import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import { PLACEMENT } from 'constants/enums/common';
import { MenuOptionsType } from 'models/common';
import { MenuInfo } from 'rc-menu/lib/interface';

export interface MenuOptionsProps {
  trigger: ['click' | 'hover' | 'contextMenu'];
  items: MenuOptionsType[];
  icon?: React.ReactNode;
  title?: string;
  itemSelected?: object;
  itemHandler: (e: MenuInfo, itemSelected?: any) => void;
  placement?: PLACEMENT;
}

const MenuOptions = (props: MenuOptionsProps) => {
  const getItemHandler = (e: MenuInfo) => {
    props.itemHandler(e, props.itemSelected);
  };
  const menu = (
    <Menu
      items={props.items}
      onClick={(e) => {
        e.domEvent.stopPropagation();
        getItemHandler(e);
      }}
    />
  );
  return (
    <Dropdown
      overlay={menu}
      trigger={props.trigger}
      placement={props.placement || PLACEMENT.BOTTOM_LEFT}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <Space className="cursor-pointer">
          {props.icon || <MoreOutlined />}
        </Space>
      </span>
    </Dropdown>
  );
};
export default MenuOptions;
