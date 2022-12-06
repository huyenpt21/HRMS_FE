import Loading from 'components/loading';
import { ACCESS_TOKEN } from 'constants/common';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginRedirect() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = search.get('token');
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      navigate('/');
    }
  }, [accessToken]);
  return <Loading />;
}
