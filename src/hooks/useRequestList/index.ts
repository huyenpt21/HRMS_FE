import { REQUEST_LIST } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  RequestListFields,
  RequestListModel,
  RequestListQuery,
  ResRequestDetail,
  ResRequestList,
  ResRequestModify,
} from 'models/request';

class RequestList implements Feature<RequestListFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const RequestListInstance = new RequestList(
  REQUEST_LIST.service,
  undefined,
  'request-list',
);

export const {
  useList: useRequestList,
  useItem: useRequestDetail,
  useAddItemModal: useAddRequestModal,
  useUpdateItem: useUpdateRequest,
  useDeleteItem: useDeleteRequest,
} = initialCustomQuery<
  RequestListModel,
  ResRequestList,
  ResRequestDetail,
  ResRequestModify,
  RequestListQuery
>(RequestListInstance);
