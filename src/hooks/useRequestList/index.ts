import { MY_REQUEST_LIST } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  RequestListQuery,
  RequestListSortFields,
  RequestModel,
  ResRequestDetail,
  ResRequestList,
  ResRequestModify,
} from 'models/request';

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
