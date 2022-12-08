import Loading from 'components/loading';
import { useAppSelector } from 'hooks';
import styles from './index.module.less';

export default function HomePage() {
  const userDetail = useAppSelector((state) => state.auth.user);
  return (
    <div className={styles.main}>
      {!!userDetail && <div className={styles.content}></div>}
      {!userDetail && <Loading />}
    </div>
  );
}
