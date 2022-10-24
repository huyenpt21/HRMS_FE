import { MY_REQUEST_LIST } from 'constants/services';
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
  MY_REQUEST_LIST.service,
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
          url: `${MY_REQUEST_LIST.service}/${MY_REQUEST_LIST.model.status}/${uid}`,
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
