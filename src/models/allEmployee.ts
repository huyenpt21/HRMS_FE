import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface EmployeeListItem extends Resource {
  rollNumber: string;
  fullName: string;
  email: string;
  departmentID: string;
  dob?: string;
  gender?: number;
  phoneNumber?: string;
  citizenIdentification?: string;
  address?: string;
  managerID?: string;
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
