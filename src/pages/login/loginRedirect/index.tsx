import Loading from 'components/loading';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginRedirect() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = search.get('token');
  useEffect(() => {
    navigate('/');
  }, [accessToken]);
  return <Loading />;
}
