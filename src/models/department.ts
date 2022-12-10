import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface DepartmentModel extends Resource {
  departmentName?: string;
  listPosition?: PositionModel[];
  totalEmployee?: number;
  isAllowDelete?: number;
}

export interface PositionModel {
  id?: number;
  positionName?: string;
  isAllowDelete?: number;
}

export interface DepartmentListFilter {
  search?: string;
  departmentId?: string;
}

export type DepartmentListSortFields = 'requestType';

export type DepartmentListQuery = QueryParams<DepartmentListSortFields> &
  DepartmentListFilter;

export type ResDepartmentList = ResponseData<
  { items: DepartmentModel[] },
  Pagination
>;

export type ResDepartmentDetail = ResponseData<{ item: DepartmentModel }, {}>;

export type ResDepartmentModify = ResponseData<{}, {}>;
