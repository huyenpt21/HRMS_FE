import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface RequestModel extends Resource {
  requestTypeName?: string;
  createDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status?: string;
  approvalDate?: string;
  personName?: string;
  receiver?: string | null;
  createdBy?: string;
  deviceTypeName?: string | null;
  date?: string;
  time?: string;
  listEvidence?: string[] | null;
}

export interface RequestStatus {
  status: string;
}

export interface RequestListFilter {
  search?: string;
  startTime?: string;
  endTime?: string;
  createDate?: string;
  requestTypeId?: string;
  status?: string;
  aprovalDate?: string;
  createDateFrom?: string;
  createDateTo?: string;
}

export type RequestListSortFields = 'requestType';

export type RequestListQuery = QueryParams<RequestListSortFields> &
  RequestListFilter;

export type ResRequestList = ResponseData<
  { items: RequestModel[] },
  Pagination
>;

export type ResRequestDetail = ResponseData<{ item: RequestModel }, {}>;

export type ResRequestModify = ResponseData<{}, {}>;
