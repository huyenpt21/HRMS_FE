import { useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

interface params {
  label?: string;
  url: string;
  limit: number;
  page: number;
  apiUrl?: string;
}

export const useGetDataOptions = (payload: params) => {
  return useQuery(
    ['list-option', payload],
    () => {
      return fetchApi(
        {
          url: payload.url,
          // options: { ...payload, ...param },
          payload,
        },
        undefined,
        payload.apiUrl,
      );
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!payload.url,
    },
  );
};
