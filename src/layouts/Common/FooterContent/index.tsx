import { HeartTwoTone } from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';
import styles from './footerContent.module.less';

interface IProps {
  marginLeft: number;
}
const FooterContent = ({ marginLeft }: IProps) => {
  return (
    <Footer
      style={{
        width: `calc(100% - ${marginLeft}px )`,
      }}
      className={styles.footer__wrapper}
    >
      <div className={styles.footer}>
        Made with <HeartTwoTone twoToneColor="#eb2f96" /> by{' '}
        <span className={styles['company-name']}>Ky nay ra truong</span>
      </div>
    </Footer>
  );
};

export default FooterContent;
