import { Badge, Image } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header } from 'antd/lib/layout/layout';
import SvgIcon from 'components/SvgIcon';
import styles from './headerContent.module.less';
interface IProps {
  marginLeft: number;
}
export default function HeaderContent({ marginLeft }: IProps) {
  const notiNum = 5;
  return (
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
            src={<Image src="https://joeschmoe.io/api/v1/random" />}
          />
        </div>
        <div className={styles['user__infor']}>
          <div className={styles.user__name}>Cậu Vàng</div>
          <div className={styles.user__role}>Nhân viên bán khô gà</div>
        </div>
        <div className={styles.user__noti}>
          <Badge count={notiNum} size={notiNum >= 10 ? 'small' : 'default'}>
            <Avatar shape="circle" size="large">
              <SvgIcon icon="notification" />
            </Avatar>
          </Badge>
        </div>
        <div className={styles.menu__expand}>
          <Avatar shape="circle" size="large">
            <SvgIcon icon="list" />
          </Avatar>
        </div>
      </div>
    </Header>
  );
}
