import { OFFICE_TIME } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import { OfficeTimelModel, ResOfficeTimelModify } from 'models/officeTime';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useGetOfficeTime = () =>
  useQuery(['get-office-time'], () =>
    fetchApi(
      {
        url: OFFICE_TIME.service,
      },
      undefined,
    ),
  );

export const useUpdateOfficeTime = ({
  onError,
  onSuccess,
}: MutationProps<ResOfficeTimelModify>) => {
  const queryClient = useQueryClient();
  return useMutation(
    (officeTime: OfficeTimelModel) =>
      fetchApi(
        {
          url: `${OFFICE_TIME.model.hr}/${OFFICE_TIME.service}`,
          options: {
            method: 'PUT',
            body: JSON.stringify(officeTime),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
      onSettled: () => {
        queryClient.invalidateQueries(['get-office-time']);
      },
    },
  );
};
export const useUpdateLunchBreakOfficeTime = ({
  onError,
  onSuccess,
}: MutationProps<ResOfficeTimelModify>) => {
  const queryClient = useQueryClient();
  return useMutation(
    (officeTime: OfficeTimelModel) =>
      fetchApi(
        {
          url: `${OFFICE_TIME.model.hr}/${OFFICE_TIME.model.lunchBreak}`,
          options: {
            method: 'PUT',
            body: JSON.stringify(officeTime),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
      onSettled: () => {
        queryClient.invalidateQueries(['get-office-time']);
      },
    },
  );
};
