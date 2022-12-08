import { EMPLOYEE } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import { NotificationQuery, ResNotifcationList } from 'models/notification';
import { useMutation, useQuery } from 'react-query';
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
export const useReadNotification = ({ onSuccess }: MutationProps<any>) => {
  return useMutation(
    (id: number) =>
      fetchApi(
        {
          url: `${EMPLOYEE.model.readNoti}/${id}`,
          options: {
            method: 'PUT',
          },
        },
        undefined,
      ),
    {
      onSuccess: successHandler(onSuccess),
    },
  );
};

export const useGetUnReadNotifications = () =>
  useQuery(['get-unread-notifs'], () =>
    fetchApi(
      {
        url: `${EMPLOYEE.service}/${EMPLOYEE.model.notification}/${EMPLOYEE.model.unread}`,
      },
      undefined,
    ),
  );
