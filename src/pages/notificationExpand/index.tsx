import { Avatar, List, message } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME_US } from 'constants/common';
import { useGetAllNorification } from 'hooks/useNotification';
import { NotifcationModel, NotificationQuery } from 'models/notification';
import VirtualList from 'rc-virtual-list';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDateFormat } from 'utils/common';
import dataMock from './dataMock.json';
import styles from './notificationExpand.module.less';
export default function NotificationExpand() {
  const navigate = useNavigate();
  const ContainerHeight = 400;
  const [stateQuery, setStateQuery] = useState<NotificationQuery>({
    limit: 5,
    page: 1,
  });
  const {
    data: { items },
  } = dataMock;
  const [dataNotiList, setDataNotiList] = useState<NotifcationModel[]>(items);

  const { mutate: dataNotification, isLoading } = useGetAllNorification({
    onSuccess: (res) => {
      const {
        data: { items },
      } = res;
      setDataNotiList(items);
    },
    onError: (res) => {
      const {
        metadat: { messageRes },
      } = res;
      message.error(messageRes);
    },
  });
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      dataNotification({
        page: stateQuery.page++,
        limit: 5,
      });
      setStateQuery({ page: stateQuery.page++, limit: 5 });
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
              onClick={() => navigate(item.redirectUrl)}
              className={styles.item}
            >
              <List.Item.Meta
                avatar={<Avatar src={item?.avtUrl} size={'large'} />}
                description={
                  <>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      <>
                        <span className={styles.text__bold}>
                          {item.userFrom}
                        </span>{' '}
                        <span>{item.content}</span>
                      </>
                    </Paragraph>
                    <div className={styles.text__date}>
                      {getDateFormat(item?.createDate, DATE_TIME_US)}
                    </div>
                  </>
                }
                className={styles.item__content}
              />
              {!item.isRead && <SvgIcon icon="active" size={10} />}
            </List.Item>
          )}
        </VirtualList>
      </List>
    </>
  );
}
