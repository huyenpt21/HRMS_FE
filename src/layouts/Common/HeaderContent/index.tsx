import { Badge, Image, notification } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header } from 'antd/lib/layout/layout';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import urls from 'constants/url';
import { useAppDispatch } from 'hooks';
import { useGetUserInfor } from 'hooks/useEmployee';
import {
  useGetUnReadNotifications,
  useReadNotification,
} from 'hooks/useNotification';
import { EmployeeModel } from 'models/employee';
import { NotifcationModel } from 'models/notification';
import MenuExpand from 'pages/menuExpand';
import NotificationExpand from 'pages/notificationExpand';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'store/slice/auth';
import styles from './headerContent.module.less';
interface IProps {
  marginLeft: number;
}
export default function HeaderContent({ marginLeft }: IProps) {
  const { REACT_APP_API_URL }: any = urls;
  const navigate = useNavigate();
  const disPatch = useAppDispatch();
  const [isShowMenuExpand, setIsShowMenuExpand] = useState(false);
  const [isShowNotiExpand, setIsShowNotiExpand] = useState(false);
  const [personInfor, setPersonInfor] = useState<EmployeeModel>();
  const [notiData, setNotiData] = useState<NotifcationModel[]>([]);
  const { data: detailUserInfo } = useGetUserInfor();
  useEffect(() => {
    if (detailUserInfo && detailUserInfo.data) {
      const {
        metadata: { message },
        data: { item: userInfo },
      } = detailUserInfo;
      if (message === MESSAGE_RES.SUCCESS && !!userInfo) {
        disPatch(login({ newUserInfor: userInfo }));
        setPersonInfor(userInfo);
      }
    }
  }, [detailUserInfo]);
  const { data: unreadNotifs, refetch: refetchGetUnreadNotifs } =
    useGetUnReadNotifications();
  const { mutate: readNoti } = useReadNotification({
    onSuccess: (res) => {
      if (res?.data === 'OK') {
        refetchGetUnreadNotifs();
      }
    },
  });
  useEffect(() => {
    if (unreadNotifs && unreadNotifs.data) {
      const {
        metadata: { message },
        data: { items },
      } = unreadNotifs;
      if (message === MESSAGE_RES.SUCCESS) {
        setNotiData(items);
      }
    }
  }, [unreadNotifs]);

  useEffect(() => {
    if (!!personInfor?.email) {
      let url = REACT_APP_API_URL + 'push-notifications/' + personInfor?.email;
      const sse = new EventSource(url);
      sse.addEventListener('user-list-event', (event) => {
        const notificationList = JSON.parse(event?.data);
        if (notificationList?.items?.length > 0) {
          setNotiData(notificationList?.items);
          notificationList?.items?.map((el: NotifcationModel) =>
            notification.info({
              message: (
                <div>
                  <b>{el?.userFrom}</b> {el?.content}
                </div>
              ),
              onClick: () => {
                el?.id && readNoti(el?.id);
                el?.redirectUrl && navigate(el?.redirectUrl);
              },
            }),
          );
        }
      });

      sse.onerror = () => {
        sse.close();
      };
      return () => {
        sse.close();
      };
    }
  }, [personInfor]);

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
            <Avatar size={50} src={<Image src={personInfor?.avatarImg} />} />
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
            {notiData?.length > 0 &&
              !!notiData[notiData?.length - 1]?.totalNotificationNotRead && (
                <Badge
                  count={
                    notiData[notiData?.length - 1]?.totalNotificationNotRead
                  }
                  size="default"
                >
                  <Avatar shape="circle" size="large">
                    <SvgIcon icon="notification" />
                  </Avatar>
                </Badge>
              )}
            {!notiData[notiData?.length - 1]?.totalNotificationNotRead && (
              <Avatar shape="circle" size="large">
                <SvgIcon icon="notification" />
              </Avatar>
            )}
            {isShowNotiExpand && (
              <NotificationExpand refecthUnreadNotif={refetchGetUnreadNotifs} />
            )}
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
