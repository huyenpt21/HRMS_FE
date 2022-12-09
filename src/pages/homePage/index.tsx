import Loading from 'components/loading';
import { useAppSelector } from 'hooks';
import styles from './index.module.less';

export default function HomePage() {
  const userDetail = useAppSelector((state) => state.auth.user);
  return (
    <>
      {!!userDetail && <div className={styles.main}></div>}
      {!userDetail && <Loading />}
    </>
  );
}
