import { MY_REQUEST_LIST } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import { fetchList } from 'hooks/useCustomQuery/fetchQuery';
import {
  RequestListSortFields,
  RequestModel,
  RequestListQuery,
  ResRequestDetail,
  ResRequestList,
  ResRequestModify,
  RequestListFilter,
} from 'models/request';
import { useQuery } from 'react-query';

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
  useList: useMyRequestList,
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

export const useSubodinateRequestList = (
  payload: RequestListFilter,
  url: string,
) => {
  return useQuery<ResRequestList>(
    ['subordinate-request-list', payload],
    () =>
      fetchList<RequestListQuery, ResRequestList>({
        payload,
        service: url,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );
};
