import { useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

interface params {
  search?: string;
}

export const useGetDataOptions = (
  payload: params,
  url: string,
  apiName: string,
  isCallApi?: boolean,
) => {
  return useQuery(
    [apiName, payload],
    () => {
      return fetchApi(
        {
          url: url,
          payload,
        },
        undefined,
      );
    },
    {
      refetchOnWindowFocus: false,
      enabled: isCallApi,
    },
  );
};
