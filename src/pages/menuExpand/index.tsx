import SvgIcon from 'components/SvgIcon';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { logout } from 'store/slice/auth';
import styles from './menuExpand.module.less';

export default function MenuExpand() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSecureCodeCreated = useAppSelector(
    (state) => state.auth.isSecureCodeCreated,
  );

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
          onClick={() =>
            isSecureCodeCreated
              ? navigate('setting/security-code/update')
              : navigate('setting/security-code/create')
          }
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
            dispatch(logout({ isLogout: true }));
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
