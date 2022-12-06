import { ACCESS_TOKEN } from 'constants/common';
import Login from 'pages/login';

export default function PrivateRoute({ children }: any) {
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);
  if (!!children && isAuthenticated) {
    return children;
  } else {
    return <Login />;
  }
}
