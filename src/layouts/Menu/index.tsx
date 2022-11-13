import { Menu } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { getItem, IMenuCProps, MenuItem, MenuItemType } from 'models/menu';
import { useMemo, useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menus } from './menu';

export default function MenuSidebar({ collapsed }: IMenuCProps) {
  const [openKeys, setOpenKeys] = useState<any>([]);
  // const [activeMenu, setActiveMenu] = useState<any>(undefined);
  const activeMenu = useRef<any>();
  const router = useLocation();
  const menuList: MenuItemType[] = menus;

  const menuItems: MenuItem[] = useMemo(() => {
    return menuList.map((menu: MenuItemType) => {
      return menu?.children?.length
        ? getItem(
            menu.title,
            menu.key,
            menu?.icon && <SvgIcon icon={menu.icon} color="#000" />,
            menu?.children.map((subMenu: MenuItemType) => {
              return getItem(
                subMenu?.path && (
                  <NavLink to={subMenu.path}>
                    {({ isActive }) => {
                      if (isActive) activeMenu.current = subMenu.key;
                      return <span>{subMenu.title}</span>;
                    }}
                  </NavLink>
                ),
                subMenu.key,
              );
            }),
          )
        : getItem(
            menu?.path && (
              <NavLink to={menu.path}>
                {({ isActive }) => {
                  if (isActive) activeMenu.current = menu.key;
                  return <span>{menu.title}</span>;
                }}
              </NavLink>
            ),
            menu.key,
            menu?.icon && <SvgIcon icon={menu.icon} size={24} color="#000" />,
          );
    });
  }, [menuList]);

  const menuActive = (path: string) => {
    let paths = path.split('/');
    paths.shift();
    setOpenKeys([paths[0]]);
  };

  const onOpenChange = (keys: string[]) => {
    if (keys.length >= 2) {
      keys.splice(0, 1);
    }
    setOpenKeys(keys);
  };
  useEffect(() => {
    const { pathname } = router;

    if (menus && menus.length) {
      menuActive(pathname);
    }
  }, [menus, router.pathname, collapsed, activeMenu.current]);
  return (
    <Menu
      theme="light"
      openKeys={openKeys}
      selectedKeys={[activeMenu.current]}
      mode="inline"
      onOpenChange={onOpenChange}
      triggerSubMenuAction="click"
      items={menuItems}
    />
  );
}
