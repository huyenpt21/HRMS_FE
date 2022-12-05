import { LOGIN_REDIRECT } from 'constants/services';
import { useMutation } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useLogin = () => {
  return useMutation(() =>
    fetchApi(
      {
        url: `${LOGIN_REDIRECT.service}`,
      },
      undefined,
    ),
  );
};
