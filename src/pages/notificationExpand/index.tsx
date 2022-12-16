import { Avatar, List, notification } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME_US } from 'constants/common';
import {
  useGetAllNorification,
  useReadNotification,
} from 'hooks/useNotification';
import { NotifcationModel, NotificationQuery } from 'models/notification';
import VirtualList from 'rc-virtual-list';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDateFormat } from 'utils/common';
import styles from './notificationExpand.module.less';
interface IProps {
  refecthUnreadNotif: () => {};
}
export default function NotificationExpand({ refecthUnreadNotif }: IProps) {
  const ContainerHeight = 400;
  const navigate = useNavigate();
  const [stateQuery, setStateQuery] = useState<NotificationQuery>({
    limit: 5,
    page: 1,
  });

  const [dataNotiList, setDataNotiList] = useState<NotifcationModel[]>([]);
  const { mutate: readNoti } = useReadNotification({
    onSuccess: (res) => {
      if (res?.data === 'OK') {
        refecthUnreadNotif();
      }
    },
  });
  const { mutate: dataNotification, isLoading } = useGetAllNorification({
    onSuccess: (res) => {
      const {
        data: { items },
      } = res;
      if (items && items?.length !== 0) {
        setDataNotiList((prev: NotifcationModel[]) => [...prev, ...items]);
      }
    },
    onError: (res) => {
      const {
        metadat: { message },
      } = res;
      if (message) {
        notification.error({
          message: message,
        });
      }
    },
  });
  useEffect(() => {
    dataNotification({
      page: stateQuery.page,
      limit: 10,
    });
  }, []);
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      dataNotification({
        page: ++stateQuery.page,
        limit: 10,
      });
      setStateQuery((prev) => ({ page: ++prev.page, limit: 10 }));
    }
  };
  return (
    <>
      <div className="backdrop"></div>
      <List className={styles.container} loading={isLoading}>
        <div className={styles.title}>Notification</div>
        <VirtualList
          data={dataNotiList}
          height={ContainerHeight}
          itemHeight={47}
          itemKey="noti"
          onScroll={onScroll}
        >
          {(item: NotifcationModel, index: number) => (
            <List.Item
              key={index}
              onClick={() => {
                item?.id && readNoti(item?.id);
                item?.redirectUrl && navigate(item?.redirectUrl);
              }}
              className={styles.item}
              title={`${item.userFrom} ${item.content}`}
            >
              <List.Item.Meta
                avatar={<Avatar src={item?.avtUrl} size={'large'} />}
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      <div>
                        <span className={styles.text__bold}>
                          {item?.userFrom}
                        </span>{' '}
                        <span>{item?.content}</span>
                      </div>
                    </Paragraph>
                    <div className={styles.text__date}>
                      {getDateFormat(item?.createDate, DATE_TIME_US)}
                    </div>
                  </>
                }
                className={styles.item__content}
              />
              {!item?.isRead && <SvgIcon icon="active" size={10} />}
            </List.Item>
          )}
        </VirtualList>
      </List>
    </>
  );
}
