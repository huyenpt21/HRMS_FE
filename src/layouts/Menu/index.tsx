import { Menu } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { getItem, MenuItem, MenuItemType } from 'models/menu';
import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menus } from './menu';

export default function MenuSidebar() {
  const [activeMenu, setActiveMenu] = useState<any>(undefined);

  const menuList: MenuItemType[] = menus;

  const menuItems: MenuItem[] = useMemo(() => {
    return menuList.map((menu: MenuItemType) => {
      return menu?.children?.length
        ? getItem(
            menu.title,
            menu.key,
            menu?.icon && (
              <div>
                <SvgIcon icon={menu.icon} color="#000" />
              </div>
            ),
            menu?.children.map((subMenu: MenuItemType) => {
              return getItem(
                subMenu?.path && (
                  <NavLink to={subMenu.path}>
                    {({ isActive }) => {
                      isActive && setActiveMenu(subMenu.key);
                      return (
                        <span className={isActive ? 'active-link' : undefined}>
                          {subMenu.title}{' '}
                        </span>
                      );
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
                  isActive && setActiveMenu(menu.key);
                  return (
                    <span className={isActive ? 'active-link' : undefined}>
                      {menu.title}
                    </span>
                  );
                }}
              </NavLink>
            ),
            menu.key,
            menu?.icon && <SvgIcon icon={menu.icon} size={24} color="#000" />,
          );
    });
  }, [menuList]);

  const onOpenChange = (keys: string[]) => {
    if (keys.length >= 2) {
      keys.splice(0, 1);
    }

    // setOpenKeys(keys);
  };
  return (
    <Menu
      theme="light"
      defaultSelectedKeys={['home']}
      selectedKeys={[activeMenu]}
      mode="inline"
      onOpenChange={onOpenChange}
      triggerSubMenuAction="click"
      items={menuItems}
    />
  );
}
