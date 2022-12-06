import SvgIcon from 'components/SvgIcon';
import { useNavigate } from 'react-router-dom';
import styles from './menuExpand.module.less';

export default function MenuExpand() {
  const navigate = useNavigate();
  return (
    <>
      <div className="backdrop"></div>
      <div className={styles.container}>
        <div className={styles.item}>
          <div className={styles.content} onClick={() => navigate('profile')}>
            <span className={styles.wrapper}>
              <SvgIcon icon="user" color="#000" />
            </span>
            <span className={styles.title}>View Profile</span>
          </div>
        </div>
        <div
          className={styles.item}
          onClick={() => navigate('setting/security-code/update')}
        >
          <div className={styles.content}>
            <span className={styles.wrapper}>
              <SvgIcon icon="setting" color="#000" />
            </span>
            <span className={styles.title}>Setting Security Code</span>
          </div>
        </div>
        <div
          className={styles.item}
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          <div className={styles.content}>
            <span className={styles.wrapper}>
              <SvgIcon icon="send-square" color="#000" />
            </span>
            <span className={styles.title}>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
}
