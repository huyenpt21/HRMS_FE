import { Image } from 'antd';
import BasicButton from 'components/BasicButton';
import styles from './login.module.less';
import logo from '../../assets/img/logo-1.png';
import SvgIcon from 'components/SvgIcon';
export default function Login() {
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
        <a href="https://api.ms-hrms.software/human-resources-management-system/oauth2/authorization/google?redirect_uri=https://ms-hrms.software/oauth2/google">
          {/* <a href="https://api.ms-hrms.software/human-resources-management-system/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/google"> */}
          <BasicButton
            icon={
              <SvgIcon
                icon={'google-2'}
                className={styles.btn__icon}
                size={50}
              />
            }
            title="Sign in with Google"
            type="outline"
            className={styles.btn__login}
          />
        </a>
      </div>
    </div>
  );
}
