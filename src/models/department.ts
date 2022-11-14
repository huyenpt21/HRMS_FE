import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface DepartmentModel extends Resource {
  departmentName?: string;
}

export interface DepartmentListFilter {
  search?: string;
  departmentId?: string;
}

export type DepartmentListSortFields = 'requestType';

export type DepartmentListQuery = QueryParams<DepartmentListSortFields> &
  DepartmentListFilter;

export type ResDepartmentList = ResponseData<
  { listDepartment: DepartmentModel[] },
  Pagination
>;

export type ResDepartmentDetail = ResponseData<{ item: DepartmentModel }, {}>;

export type ResDepartmentModify = ResponseData<{}, {}>;
