import Loading from 'components/loading';
import { ACCESS_TOKEN, MESSAGE_RES } from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useGetUserRoles } from 'hooks/useEmployee';
import {
  menuEmployee,
  menuHR,
  menuHrManager,
  menuItSupport,
  menuItSupportManager,
  menuManager,
  menus,
  menuSubEmployee,
} from 'layouts/Menu/menu';
import { EmployeeRoles } from 'models/employee';
import { MenuItemType } from 'models/menu';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserMenu, getUserRoles } from 'store/slice/auth';
export default function LoginRedirect() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const accessToken = search.get('token');
  useEffect(() => {
    if (!!accessToken) {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
    } else {
      navigate('/403');
    }
  }, []);
  const dispatch = useAppDispatch();
  const acLocal = localStorage.getItem(ACCESS_TOKEN);
  console.log(acLocal);
  const { data: getUserRole } = useGetUserRoles(acLocal ?? '');
  useEffect(() => {
    if (getUserRole && getUserRole.data) {
      const {
        metadata: { message },
        data: { items },
      } = getUserRole;
      if (message === MESSAGE_RES.SUCCESS && items.length) {
        //* get roles of user
        let userRoles: number[] = [];
        items?.forEach((role: EmployeeRoles) => {
          if (role.roleId) {
            userRoles.push(role?.roleId);
          }
        });
        dispatch(getUserRoles({ userRoles: userRoles }));
        //* get list of menu
        let menuList: MenuItemType[] = [];
        if (userRoles.length >= 4) {
          menuList = menus;
        } else if (userRoles.toString() === [1, 2, 3].toString()) {
          menuList = [...menuEmployee, ...menuHrManager];
        } else if (userRoles.toString() === [2, 3, 5].toString()) {
          menuList = [
            ...menuEmployee,
            ...menuItSupportManager,
            ...menuSubEmployee,
          ];
        } else if (userRoles.toString() === [2, 3].toLocaleString()) {
          menuList = [...menuEmployee, ...menuManager, ...menuSubEmployee];
        } else if (userRoles.toString() === [1, 3].toLocaleString()) {
          menuList = [...menuEmployee, ...menuHR];
        } else if (userRoles.toString() === [3, 5].toString()) {
          menuList = [...menuEmployee, ...menuItSupport, ...menuSubEmployee];
        } else if (userRoles.toString() === [3].toString()) {
          menuList = [...menuEmployee, ...menuSubEmployee];
        }
        dispatch(getUserMenu({ userMenu: menuList }));
      }
      navigate('/');
    }
  }, [getUserRole, acLocal]);
  return <Loading />;
}
