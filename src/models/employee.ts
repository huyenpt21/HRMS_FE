import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface EmployeeModel extends Resource {
  rollNumber?: string;
  fullName?: string;
  email?: string;
  departmentId?: string;
  dateOfBirth?: string;
  gender?: number;
  phoneNumber?: string;
  citizenIdentification?: string;
  address?: string;
  managerId?: string;
  positionId?: string;
  rankId?: string;
  onBoardDate?: string;
  isManager?: number;
  isActive?: number;
}

export interface EmployeeListFilter {
  search?: string;
  departmentId?: number;
  positionId?: number;
  isActive?: number;
}

export type EmployeeListFields = 'code' | 'email' | 'position' | 'department';

export type EmployeeListQuery = QueryParams<EmployeeListFields> &
  EmployeeListFilter;

export type ResEmployeeList = ResponseData<
  { items: EmployeeModel[] },
  Pagination
>;

export type ResEmployeeDetail = ResponseData<{ item: EmployeeModel }, {}>;

export type ResEmployeeModify = ResponseData<{}, {}>;
