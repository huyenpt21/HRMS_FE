import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface RequestListModel extends Resource {
  requestType?: string;
  createDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status?: string;
  aprovalDate?: string;
  personName?: string;
}

export interface RequestListFilter {
  search?: string;
  startTime?: string;
  endTime?: string;
  createDate?: string;
  requestType?: string;
  status?: string;
  aprovalDate?: string;
}

export type RequestListSortFields = 'requestType';

export type RequestListQuery = QueryParams<RequestListSortFields> &
  RequestListFilter;

export type ResRequestList = ResponseData<
  { requestList: RequestListModel[] },
  Pagination
>;

export type ResRequestDetail = ResponseData<{ request: RequestListModel }, {}>;

export type ResRequestModify = ResponseData<{}, {}>;