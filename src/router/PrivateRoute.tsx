import Login from 'pages/login';
import { AppContextInterface, AuthConsumer } from 'providers/authProvider';

export default function PrivateRoute({ children }: any) {
  return (
    <AuthConsumer>
      {({ isAuthenticated }: AppContextInterface) => {
        if (!!children && isAuthenticated()) {
          return children;
        } else {
          return <Login />;
        }
      }}
    </AuthConsumer>
  );
}
