import { REQUEST } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
  UpdateProps,
} from 'hooks/useCustomQuery';
import {
  RequestListQuery,
  RequestListSortFields,
  RequestModel,
  RequestRemainingTime,
  RequestStatus,
  ResRequestDetail,
  ResRequestList,
  ResRequestModify,
} from 'models/request';
import { useMutation, useQueryClient } from 'react-query';
import fetchApi from 'utils/fetch-api';

class RequestList implements Feature<RequestListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const RequestListInstance = new RequestList(
  REQUEST.service,
  undefined,
  'my-request-list',
);

export const {
  useList: useRequestList,
  useItem: useRequestDetail,
  useAddItemModal: useAddRequestModal,
  useUpdateItem: useUpdateRequest,
  useDeleteItem: useDeleteRequest,
} = initialCustomQuery<
  RequestModel,
  ResRequestList,
  ResRequestDetail,
  ResRequestModify,
  RequestListQuery
>(RequestListInstance);

export const useChangeStatusRequest = ({
  onError,
  onSuccess,
}: MutationProps<ResRequestModify>) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ uid, body }: UpdateProps<RequestStatus>) =>
      fetchApi(
        {
          url: `${REQUEST.service}/${REQUEST.model.status}/${uid}`,
          options: {
            method: 'PUT',
            body: JSON.stringify(body),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
      onSettled: () => {
        queryClient.invalidateQueries(['my-request-list']);
      },
    },
  );
};

export const useCancelRequest = ({
  onError,
  onSuccess,
}: MutationProps<ResRequestModify>) => {
  const queryClient = useQueryClient();
  return useMutation(
    (id: number) =>
      fetchApi(
        {
          url: `${REQUEST.service}/${REQUEST.model.cancel}/${id}`,
          options: {
            method: 'PUT',
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
      onSettled: () => {
        queryClient.invalidateQueries(['my-request-list']);
      },
    },
  );
};

export const useGetRemainingTime = ({
  onError,
  onSuccess,
}: MutationProps<ResRequestModify>) => {
  return useMutation(
    (payload: RequestRemainingTime) =>
      fetchApi(
        {
          url: `${REQUEST.service}/${REQUEST.model.remainingTime}`,
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
export const useCheckRemainDevice = ({
  onError,
  onSuccess,
}: MutationProps<ResRequestModify>) => {
  return useMutation(
    (deviceTypeId?: number) =>
      fetchApi(
        {
          url: `${REQUEST.model.remainDevice}?deviceTypeId=${deviceTypeId}`,
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
