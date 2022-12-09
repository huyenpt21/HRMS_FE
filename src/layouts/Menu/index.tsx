import { Menu } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { useAppSelector } from 'hooks';
import { getItem, IMenuCProps, MenuItem, MenuItemType } from 'models/menu';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function MenuSidebar({ collapsed }: IMenuCProps) {
  const [openKeys, setOpenKeys] = useState<any>([]);
  const [activeMenu, setActiveMenu] = useState<any>(undefined);
  const router = useLocation();
  const menuList: MenuItemType[] = useAppSelector((state) => state.auth.menus);
  console.log(4444, menuList);
  // const urlPathInMenu: (string | undefined)[] = menuList?.flatMap(
  //   (item: MenuItemType) => {
  //     if (item?.children) {
  //       return item?.children.flatMap((el: MenuItemType) => {
  //         return el?.path;
  //       });
  //     }
  //     return item?.path;
  //   },
  // );
  // const isAllowAccess = !!urlPathInMenu.find((item?: string) => {
  //   return router.pathname?.includes(item ?? '');
  // });
  // console.log(3333, router, urlPathInMenu);
  // if (!isAllowAccess) {
  //   // navigate('/403');
  // }
  const menuItems: MenuItem[] = useMemo(() => {
    return menuList?.map((menu: MenuItemType) => {
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
    if (menuList && menuList.length) {
      menuActive(pathname);
    }
  }, [menuList, router.pathname, collapsed, activeMenu]);
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
