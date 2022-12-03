import { EMPLOYEE } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import { NotificationQuery, ResNotifcationList } from 'models/notification';
import { useMutation } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useGetAllNorification = ({
  onError,
  onSuccess,
}: MutationProps<ResNotifcationList>) => {
  return useMutation(
    (payload: NotificationQuery) =>
      fetchApi(
        {
          url: `${EMPLOYEE.service}/${EMPLOYEE.model.notification}`,
          payload,
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
