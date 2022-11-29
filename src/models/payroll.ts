import { Resource, ResponseData } from './common';

export interface PayrollModel extends Resource {
  personId?: number;
  personName?: string;
  rollNumber: string;
  totalWork: number;
  actualWork: number;
  basicSalary: string;
  otSalary: string;
  fineAmount: string;
  salaryBonus: string;
  tax: string;
  socialInsurance: string;
  actuallyReceived: string;
}

export interface SercurityCode {
  secureCode: string;
  confirmSecureCode: string;
}

export interface PayrollFilter {
  month?: number;
  year?: number;
}

export type PayrollQuery = PayrollFilter;

export type ResPayrollDetail = ResponseData<
  { payrollDisplayDto: PayrollModel },
  {}
>;
