import Loading from 'components/loading';
import { MESSAGE_RES } from 'constants/common';
import { useAppDispatch } from 'hooks';
import { useGetUserInfor } from 'hooks/useEmployee';
import { useEffect, useState } from 'react';
import { login } from 'store/slice/auth';
import styles from './index.module.less';

export default function HomePage() {
  const disPatch = useAppDispatch();
  const [userDetail, setUserDetail] = useState<any>(undefined);
  const { data: detailUserInfo } = useGetUserInfor();
  useEffect(() => {
    if (detailUserInfo && detailUserInfo.data) {
      const {
        metadata: { message },
        data: { item: userInfo },
      } = detailUserInfo;
      if (message === MESSAGE_RES.SUCCESS && !!userInfo) {
        disPatch(login({ newUserInfor: userInfo }));
        setUserDetail(userInfo);
      }
    }
  }, [detailUserInfo]);

  return (
    <div className={styles.main}>
      {!!userDetail && <div className={styles.content}></div>}
      {!userDetail && <Loading />}
    </div>
  );
}
