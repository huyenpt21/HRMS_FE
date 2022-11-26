import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface EmployeeModel extends Resource {
  rollNumber?: string;
  fullName?: string;
  email?: string;
  departmentId?: number;
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
  managerName?: string;
  departmentName?: string;
  positionName?: string;
  rankingName?: string;
  avatar?: string;
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
  { items: EmployeeModel[] },
  Pagination
>;

export type ResEmployeeDetail = ResponseData<{ item: EmployeeModel }, {}>;

export type ResEmployeeModify = ResponseData<{}, {}>;
