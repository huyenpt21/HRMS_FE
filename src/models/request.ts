import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface RequestModel extends Resource {
  requestType?: string;
  createDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status: string;
  approvalDate?: string;
  personName?: string;
  receiver?: string;
  createdBy?: string;
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
  { requestList: RequestModel[] },
  Pagination
>;

export type ResRequestDetail = ResponseData<{ request: RequestModel }, {}>;

export type ResRequestModify = ResponseData<{}, {}>;
