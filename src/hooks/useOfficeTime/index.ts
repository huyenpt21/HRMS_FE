import { OFFICE_TIME } from 'constants/services';
import { useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useGetOfficeTime = () =>
  useQuery(['office-time'], () =>
    fetchApi(
      {
        url: OFFICE_TIME.service,
      },
      undefined,
    ),
  );
