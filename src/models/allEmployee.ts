import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface EmployeeListItem extends Resource {
  code: string;
  name: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
}

export interface EmployeeListFilter {
  search?: string;
  department?: string;
  positon?: string;
}

export type EmployeeListFields = 'code' | 'email' | 'position' | 'department';

export type EmployeeListQuery = QueryParams<EmployeeListFields> &
  EmployeeListFilter;

export type ResEmployeeList = ResponseData<
  { items: EmployeeListItem[] },
  Pagination
>;

export type ResEmployeeDetail = ResponseData<{ item: EmployeeListItem }, {}>;

export type ResEmployeeModify = ResponseData<{}, {}>;
