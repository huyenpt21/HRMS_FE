import { Resource, ResponseData } from './common';

export interface PayslipModel extends Resource {
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
  currentSecureCode?: string;
  newSecureCode?: string;
  confirmSecureCode?: string;
}

export interface PayslipFilter {
  month?: number;
  year?: number;
}

export type PayslipQuery = PayslipFilter;

export type ResPayslipDetail = ResponseData<
  { payrollDisplayDto: PayslipModel },
  {}
>;
export type ResPayslipModify = ResponseData<any, {}>;
