import { HeartTwoTone } from '@ant-design/icons';
import styles from './index.module.less';

const FooterContent = () => {
  return (
    <div className={styles.footer}>
      Made with <HeartTwoTone twoToneColor="#eb2f96" /> by{' '}
      <span className={styles['company-name']}>Ky nay ra truong</span>
    </div>
  );
};

export default FooterContent;
