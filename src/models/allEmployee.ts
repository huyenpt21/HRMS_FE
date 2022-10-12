import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface EmployeeListItem extends Resource {
  rollNumber: string;
  name: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  citizenIdentification?: string;
  individualEmail?: string;
  address?: string;
  companyEmail?: string;
  manager?: string;
  department?: string;
  position?: string;
  ranking?: string;
  onBoardDate?: string;
  isManager?: boolean;
  isActive?: boolean;
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
  { employeeList: EmployeeListItem[] },
  Pagination
>;

export type ResEmployeeDetail = ResponseData<
  { employee: EmployeeListItem },
  {}
>;

export type ResEmployeeModify = ResponseData<{}, {}>;
