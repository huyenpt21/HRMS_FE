import { Avatar, List, message } from 'antd';
import { useGetAllNorification } from 'hooks/useNotification';
import { NotifcationModel, NotificationQuery } from 'models/notification';
import VirtualList from 'rc-virtual-list';
import { useState } from 'react';
import styles from './notificationExpand.module.less';
import dataMock from './dataMock.json';
import { useNavigate } from 'react-router-dom';
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

  const { mutate: dataNotification } = useGetAllNorification({
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
      <List className={styles.container}>
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
                avatar={
                  <Avatar src="https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d" />
                }
                description={
                  <>
                    <span className={styles.text__bold}>{item.userFrom}</span>{' '}
                    <span>{item.content}</span>
                  </>
                }
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </>
  );
}
