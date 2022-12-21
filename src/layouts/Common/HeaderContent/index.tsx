import { Client } from '@stomp/stompjs';
import { Badge, Image, notification } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header } from 'antd/lib/layout/layout';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import urls from 'constants/url';
import { useAppSelector } from 'hooks';
import { useGetUnReadNotifications } from 'hooks/useNotification';
import { NotifcationModel } from 'models/notification';
import MenuExpand from 'pages/menuExpand';
import NotificationExpand from 'pages/notificationExpand';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './headerContent.module.less';
interface IProps {
  marginLeft: number;
}
export default function HeaderContent({ marginLeft }: IProps) {
  const { REACT_APP_API_URL_WSS } = urls;
  const navigate = useNavigate();
  const personInfor = useAppSelector((state) => state.auth.user);
  const [isShowMenuExpand, setIsShowMenuExpand] = useState(false);
  const [isShowNotiExpand, setIsShowNotiExpand] = useState(false);
  const [totalUnreadNotifs, setTotalUnreadNotifs] = useState<number>(0);
  const isLogout = useAppSelector((state) => state.auth.isLogout);
  const { data: unreadNotifs, refetch: refetchGetUnreadNotifs } =
    useGetUnReadNotifications();

  useEffect(() => {
    if (unreadNotifs && unreadNotifs.data) {
      const {
        metadata: { message },
        data: totalUnreadNotif,
      } = unreadNotifs;
      if (message === MESSAGE_RES.SUCCESS) {
        setTotalUnreadNotifs(totalUnreadNotif);
      }
    }
  }, [unreadNotifs]);

  useEffect(() => {
    const url = `${REACT_APP_API_URL_WSS}ws`;
    // Connection for single person
    if (!!personInfor?.id) {
      const client = new Client({
        brokerURL: url,
      });
      client.onConnect = function (frame) {
        const subscriptionSingle = client?.subscribe(
          `/notification/${personInfor?.id}`,
          (message) => {
            if (message.body) {
              const notificationList = JSON.parse(message.body);
              if (notificationList?.length > 0) {
                setTotalUnreadNotifs((prev) => prev + notificationList.length);
                notificationList?.map((el: NotifcationModel) =>
                  notification.info({
                    message: (
                      <div>
                        <b>{el?.userFrom}</b> {el?.content}
                      </div>
                    ),
                    onClick: () => {
                      //send message read notif
                      client.publish({
                        destination: '/ms-hrms/read-notifications',
                        body: el?.id + '',
                        skipContentLengthHeader: true,
                      });
                      //re-fetch get total unread notifs
                      refetchGetUnreadNotifs();
                      //redirect to notif page
                      el?.redirectUrl && navigate(el?.redirectUrl);
                    },
                  }),
                );
              }
            }
            //re-fetch get total unread notifs
            refetchGetUnreadNotifs();
          },
        );
        //unsubcribe
        if (isLogout) {
          subscriptionSingle.unsubscribe();
        }
      };
      client.activate();
    }
  }, [isLogout]);

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
            {!!totalUnreadNotifs && (
              <Badge count={totalUnreadNotifs} size="default">
                <Avatar shape="circle" size="large">
                  <SvgIcon icon="notification" />
                </Avatar>
              </Badge>
            )}
            {!totalUnreadNotifs && (
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
