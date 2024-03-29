import { MenuProps } from 'antd';

export interface IMenuCProps {
  collapsed?: boolean;
}

export interface MenuItemType {
  title: string;
  key: string;
  icon?: string | React.ReactNode;
  path?: string;
  children?: MenuItemType[];
}

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
