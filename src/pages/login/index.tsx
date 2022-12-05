import { Image } from 'antd';
import BasicButton from 'components/BasicButton';
import { useLogin } from 'hooks/useLogin';
import styles from './login.module.less';
import logo from '../../assets/img/logo-1.png';
import SvgIcon from 'components/SvgIcon';
export default function Login() {
  const { mutate: login } = useLogin();
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src={logo}
          preview={false}
          width={'8rem'}
          className={styles.logo}
        />
        <h1 className={styles.title}>Welcome to Minswap</h1>
        <BasicButton
          icon={
            <SvgIcon icon={'google-2'} className={styles.btn__icon} size={50} />
          }
          title="Sign in with Google"
          type="outline"
          onClick={() => {
            login();
          }}
          className={styles.btn__login}
        />
      </div>
    </div>
  );
}
