import Loading from 'components/loading';
import {
  ACCESS_TOKEN,
  MESSAGE_RES,
  USER_INFO,
  USER_ROLES,
} from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useGetuserInfo, useGetUserRoles } from 'hooks/useEmployee';

import { EmployeeRoles } from 'models/employee';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserInfo, getUserRoles } from 'store/slice/auth';
export default function LoginRedirect() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search] = useSearchParams();
  const accessToken = search.get('token');
  useEffect(() => {
    if (!!accessToken) {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
    } else {
      navigate('/403');
    }
  }, []);
  const acLocal = localStorage.getItem(ACCESS_TOKEN);
  const { data: getUserRole } = useGetUserRoles(acLocal ?? '');
  const { data: detailUserInfo } = useGetuserInfo(acLocal ?? '');
  useEffect(() => {
    if (detailUserInfo && detailUserInfo.data) {
      const {
        metadata: { message },
        data: { item: userInfo },
      } = detailUserInfo;
      if (message === MESSAGE_RES.SUCCESS && !!userInfo) {
        dispatch(getUserInfo({ newUserInfor: userInfo }));
        localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
      }
    }
  }, [detailUserInfo]);
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
        localStorage.setItem(USER_ROLES, JSON.stringify(userRoles));
      }
      navigate('/');
    }
  }, [getUserRole, acLocal]);
  return <Loading />;
}
