import Loading from 'components/loading';
import { MESSAGE_RES } from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useGetUserInfor, useGetUserRoles } from 'hooks/useEmployee';
import { useEffect, useState } from 'react';
import { login } from 'store/slice/auth';
import styles from './index.module.less';

export default function HomePage() {
  const disPatch = useAppDispatch();
  const [userDetail, setUserDetail] = useState<any>(undefined);
  const { data: detailUserInfo } = useGetUserInfor();
  const { data: getUserRole } = useGetUserRoles();
  console.log(3333, userDetail);
  useEffect(() => {
    if (detailUserInfo && detailUserInfo.data) {
      const {
        metadata: { message },
        data: { item: userInfo },
      } = detailUserInfo;
      if (message === MESSAGE_RES.SUCCESS && userInfo) {
        disPatch(login({ newUserInfor: userInfo }));
        setUserDetail(userInfo);
      }
    }
  }, [detailUserInfo]);
  useEffect(() => {
    if (getUserRole && getUserRole.data) {
      const {
        metadata: { message },
        data: { items: userRoles },
      } = getUserRole;
      if (message === MESSAGE_RES.SUCCESS && userRoles) {
        disPatch(login({ userRoles: userRoles }));
        setUserDetail((prev: any) => ({ ...prev, roles: userRoles }));
      }
    }
  }, [getUserRole]);
  return (
    <div className={styles.main}>
      {!!userDetail && userDetail?.roles?.length > 0 && (
        <div className={styles.content}></div>
      )}
      {(!userDetail || userDetail?.roles?.length === 0) && <Loading />}
    </div>
  );
}
