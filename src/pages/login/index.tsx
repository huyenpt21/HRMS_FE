// import Loading from 'components/loading';
import BasicButton from 'components/BasicButton';
import { useLogin } from 'hooks/useLogin';
import { AuthConsumer } from 'providers/authProvider';
import styles from './login.module.less';
export default function Login() {
  const { mutate: login } = useLogin();
  return (
    <AuthConsumer>
      {() => {
        return (
          <div className={styles.container}>
            <BasicButton
              title="Login"
              type="filled"
              onClick={() => {
                login();
              }}
            />
          </div>
        );
      }}
    </AuthConsumer>
  );
}
