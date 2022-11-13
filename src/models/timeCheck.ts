import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface TimeCheckModel extends Resource {
  personName?: string;
  rollNumber?: string;
  date?: string;
  inLate?: number;
  outEarly?: number;
  timeIn?: string;
  timeOut?: string;
  ot?: number;
  workingTime?: number;
  requestTypeName?: string;
}

export interface TimeCheckListFilter {
  search?: string;
  startDate?: string;
  endDate?: string;
  personId?: number;
}

export interface TimeCheckEmployeeInfo {
  personName?: string;
  rollNumber?: string;
}

export type TimeCheckListSortFields = 'personName';

export type TimeCheckListQuery = QueryParams<TimeCheckListSortFields> &
  TimeCheckListFilter;

export type ResTimeCheckList = ResponseData<
  {
    timeCheckList: TimeCheckModel[];
  },
  Pagination
>;

export type ResTimeCheckDetail = ResponseData<{ item: TimeCheckModel }, {}>;

export type ResTimeCheckModify = ResponseData<{}, {}>;
