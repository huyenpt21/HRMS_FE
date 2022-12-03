import { Badge, Image } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header } from 'antd/lib/layout/layout';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { useGetUserInfor } from 'hooks/useEmployee';
import { EmployeeModel } from 'models/employee';
import MenuExpand from 'pages/menuExpand';
import NotificationExpand from 'pages/notificationExpand';
import { useEffect, useState } from 'react';
import styles from './headerContent.module.less';
interface IProps {
  marginLeft: number;
}
export default function HeaderContent({ marginLeft }: IProps) {
  const notiNum = 5;
  const [isShowMenuExpand, setIsShowMenuExpand] = useState(false);
  const [isShowNotiExpand, setIsShowNotiExpand] = useState(false);
  const [personInfor, setPersonInfor] = useState<EmployeeModel>();
  const { data: detailUserInfo } = useGetUserInfor();
  useEffect(() => {
    if (detailUserInfo && detailUserInfo.data) {
      const {
        metadata: { message },
        data: { item: userInfo },
      } = detailUserInfo;
      if (message === MESSAGE_RES.SUCCESS && userInfo) {
        setPersonInfor(userInfo);
      }
    }
  }, [detailUserInfo]);

  return (
    <>
      <Header
        style={{
          width: `calc(100% - ${marginLeft + 56}px )`,
          padding: '0 32px',
        }}
        className={styles.header__wrapper}
      >
        <div className={styles.container}>
          <div className={styles['user__avt']}>
            <Avatar
              size={50}
              src={
                <Image
                  src={
                    personInfor?.avatarImg ??
                    'https://joeschmoe.io/api/v1/random'
                  }
                />
              }
            />
          </div>
          <div className={styles['user__infor']}>
            <div className={styles.user__name}>{personInfor?.fullName}</div>
            <div className={styles.user__role}>{personInfor?.positionName}</div>
          </div>
          <div
            className={styles.user__noti}
            onClick={() => {
              setIsShowNotiExpand(!isShowNotiExpand);
              setIsShowMenuExpand(false);
            }}
          >
            <Badge count={notiNum} size={notiNum >= 10 ? 'small' : 'default'}>
              <Avatar shape="circle" size="large">
                <SvgIcon icon="notification" />
              </Avatar>
            </Badge>
            {isShowNotiExpand && <NotificationExpand />}
          </div>
          <div
            className={styles.menu__expand}
            onClick={() => {
              setIsShowMenuExpand(!isShowMenuExpand);
              setIsShowNotiExpand(false);
            }}
          >
            <Avatar shape="circle" size="large">
              <SvgIcon icon="list" />
            </Avatar>
            {isShowMenuExpand && <MenuExpand />}
          </div>
        </div>
      </Header>
    </>
  );
}
