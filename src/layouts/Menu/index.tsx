import { Menu } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { useGetUserRoles } from 'hooks/useEmployee';
import { EmployeeRoles } from 'models/employee';
import { getItem, IMenuCProps, MenuItem, MenuItemType } from 'models/menu';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  const router = useLocation();
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<number[]>([]);
  const { data: getUserRole } = useGetUserRoles();
  useEffect(() => {
    if (getUserRole && getUserRole.data) {
      const {
        metadata: { message },
        data: { items },
      } = getUserRole;
      if (message === MESSAGE_RES.SUCCESS && items.length) {
        let roles: number[] = [];
        items?.forEach((role: EmployeeRoles) => {
          if (role.roleId) {
            roles.push(role?.roleId);
          }
        });
        setUserRoles(roles);
      }
    }
  }, [getUserRole]);
  let menuList: MenuItemType[] = [];
  if (userRoles.length >= 4) {
    menuList = menus;
  } else if (userRoles.toString() === [1, 2, 3].toString()) {
    menuList = [...menuEmployee, ...menuHrManager];
  } else if (userRoles.toString() === [2, 3, 5].toString()) {
    menuList = [...menuEmployee, ...menuItSupportManager, ...menuSubEmployee];
  } else if (userRoles.toString() === [2, 3].toLocaleString()) {
    menuList = [...menuEmployee, ...menuManager, ...menuSubEmployee];
  } else if (userRoles.toString() === [1, 3].toLocaleString()) {
    menuList = [...menuEmployee, ...menuHR];
  } else if (userRoles.toString() === [3, 5].toString()) {
    menuList = [...menuEmployee, ...menuItSupport, ...menuSubEmployee];
  } else if (userRoles.toString() === [3].toString()) {
    menuList = [...menuEmployee, ...menuSubEmployee];
  }
  const urlPathInMenu: (string | undefined)[] = menuList.flatMap(
    (item: MenuItemType) => {
      if (item?.children) {
        return item?.children.flatMap((el: MenuItemType) => {
          return el?.path;
        });
      }
      return item?.path;
    },
  );
  const isAllowAccess = !!urlPathInMenu.find((item?: string) => {
    return router.pathname?.includes(item ?? '');
  });
  if (!isAllowAccess) {
    navigate('/403');
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
