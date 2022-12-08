import { Menu } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useGetUserRoles } from 'hooks/useEmployee';
import { EmployeeRoles } from 'models/employee';
import { getItem, IMenuCProps, MenuItem, MenuItemType } from 'models/menu';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { login } from 'store/slice/auth';
import {
  menuEmployee,
  menuHR,
  menuHrManager,
  menuItSupport,
  menuItSupportManager,
  menuManager,
  menus,
  menuSubEmployee,
} from './menu';

export default function MenuSidebar({ collapsed }: IMenuCProps) {
  const [openKeys, setOpenKeys] = useState<any>([]);
  const [activeMenu, setActiveMenu] = useState<any>(undefined);
  // const activeMenu = useRef<any>();
  const router = useLocation();
  const disPatch = useAppDispatch();
  const [userRoles, setUserRoles] = useState<EmployeeRoles[]>([]);
  const { data: getUserRole } = useGetUserRoles();
  useEffect(() => {
    if (getUserRole && getUserRole.data) {
      const {
        metadata: { message },
        data: { items: userRoles },
      } = getUserRole;
      if (message === MESSAGE_RES.SUCCESS && !!userRoles.length) {
        setUserRoles(userRoles);
        disPatch(login({ userRoles: userRoles }));
      }
    }
  }, [getUserRole]);
  let roles: number[] = [];
  let menuList: MenuItemType[] = [];
  userRoles?.forEach((role: EmployeeRoles) => {
    if (role.roleId) {
      roles.push(role?.roleId);
    }
  });
  if (roles.length >= 4) {
    menuList = menus;
  } else if (roles.toString() === [1, 2, 3].toString()) {
    menuList = [...menuEmployee, ...menuHrManager];
  } else if (roles.toString() === [2, 3, 5].toString()) {
    menuList = [...menuEmployee, ...menuItSupportManager, ...menuSubEmployee];
  } else if (roles.toString() === [2, 3].toLocaleString()) {
    menuList = [...menuEmployee, ...menuManager, ...menuSubEmployee];
  } else if (roles.toString() === [1, 3].toLocaleString()) {
    menuList = [...menuEmployee, ...menuHR];
  } else if (roles.toString() === [3, 5].toString()) {
    menuList = [...menuEmployee, ...menuItSupport, ...menuSubEmployee];
  } else if (roles.toString() === [3].toString()) {
    menuList = [...menuEmployee, ...menuSubEmployee];
  }
  const menuItems: MenuItem[] = useMemo(() => {
    return menuList.map((menu: MenuItemType) => {
      return menu?.children?.length
        ? getItem(
            menu.title,
            menu.key,
            menu?.icon && typeof menu.icon === 'string' ? (
              <SvgIcon icon={menu.icon} color="#000" />
            ) : (
              menu.icon
            ),
            menu?.children.map((subMenu: MenuItemType) => {
              return getItem(
                subMenu?.path && (
                  <NavLink to={subMenu.path}>
                    {({ isActive }) => {
                      // if (isActive) activeMenu.current = subMenu.key;
                      if (isActive) setActiveMenu(subMenu.key);
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
                  // if (isActive) activeMenu.current = menu.key;
                  if (isActive) setActiveMenu(menu.key);
                  return <span>{menu.title}</span>;
                }}
              </NavLink>
            ),
            menu.key,
            menu?.icon && typeof menu.icon === 'string' ? (
              <SvgIcon icon={menu.icon} size={24} color="#000" />
            ) : (
              menu.icon
            ),
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
  }, [menus, router.pathname, collapsed, activeMenu]);
  return (
    <Menu
      theme="light"
      openKeys={openKeys}
      activeKey={activeMenu}
      selectedKeys={[activeMenu]}
      mode="inline"
      onOpenChange={onOpenChange}
      triggerSubMenuAction="click"
      items={menuItems}
    />
  );
}
