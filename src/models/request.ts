import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface RequestModel extends Resource {
  requestTypeId?: number;
  requestTypeName?: string;
  createDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  status?: string;
  approvalDate?: string;
  personName?: string;
  receiver?: string;
  createdBy?: string;
  deviceTypeId?: string;
  date?: string;
  time?: string;
  listEvidence?: string[];
  timeRemaining?: number;
  isAllowRollback?: number;
  isAssigned?: number;
  deviceTypeName?: string;
}

export interface OfficeTime {
  timeStart?: string;
  timeFinish?: string;
}

export interface RequestStatus {
  status: string;
}

export interface RequestRemainingTime {
  requestTypeId?: number;
  month: number;
  year: number;
  timeRemaining?: number;
}

export interface RequestListFilter {
  search?: string;
  startTime?: string;
  endTime?: string;
  createDate?: string;
  requestTypeId?: number;
  status?: string;
  aprovalDate?: string;
  createDateFrom?: string;
  createDateTo?: string;
  approvalDateFrom?: string;
  approvalDateTo?: string;
  isAssigned?: number;
  deviceTypeId?: string;
}

export type RequestListSortFields = 'requestType';

export type RequestListQuery = QueryParams<RequestListSortFields> &
  RequestListFilter;

export type ResRequestList = ResponseData<
  { items: RequestModel[] },
  Pagination
>;

export type ResRequestDetail = ResponseData<{ item: RequestModel }, {}>;

export type ResRequestModify = ResponseData<{ item: RequestRemainingTime }, {}>;
