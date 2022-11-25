import { Badge, Image } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header } from 'antd/lib/layout/layout';
import SvgIcon from 'components/SvgIcon';
import { useState } from 'react';
import MenuExpand from '../menuExpand';
import styles from './headerContent.module.less';
interface IProps {
  marginLeft: number;
}
export default function HeaderContent({ marginLeft }: IProps) {
  const notiNum = 5;
  const [isShowMenuExpand, setIsShowMenuExpand] = useState(false);
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
              size={42}
              src={
                <Image src="https://i.pinimg.com/736x/ed/c9/cb/edc9cb773659891ba03594a3a180887a.jpg" />
              }
            />
          </div>
          <div className={styles['user__infor']}>
            <div className={styles.user__name}>Meow</div>
            <div className={styles.user__role}>True love not choose love</div>
          </div>
          <div className={styles.user__noti}>
            <Badge count={notiNum} size={notiNum >= 10 ? 'small' : 'default'}>
              <Avatar shape="circle" size="large">
                <SvgIcon icon="notification" />
              </Avatar>
            </Badge>
          </div>
          <div
            className={styles.menu__expand}
            onClick={() => setIsShowMenuExpand(!isShowMenuExpand)}
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
