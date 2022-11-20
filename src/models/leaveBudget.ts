import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface LeaveBudgetModel extends Resource {
  fullName?: string;
  leaveBudget?: number;
  numberOfDayOff?: number;
  remainDayOff?: number;
  requestTypeName?: string;
}

export interface LeaveBudgetListFilter {
  search?: string;
}

export type LeaveBudgetListSortFields = 'fullName';

export type LeaveBudgetListQuery = QueryParams<LeaveBudgetListSortFields> &
  LeaveBudgetListFilter;

export type ResLeaveBudgetList = ResponseData<
  { items: LeaveBudgetModel[] },
  Pagination
>;

export type ResLeaveBudgetDetail = ResponseData<{ item: LeaveBudgetModel }, {}>;

export type ResLeaveBudgetModify = ResponseData<{}, {}>;
