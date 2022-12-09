import { Pagination, QueryParams, ResponseData } from './common';

export interface SignatureProfileModel {
  employeeName?: string;
  registeredDate?: string;
  isRegistered?: number;
  personId?: number;
}

export interface SignatureProfileListFilter {
  search?: string;
  isRegistered?: number;
}

export interface SignatureRegister {
  idSignature?: string;
  personId?: string;
}

export type SignatureProfileListSortFields = 'personName';

export type SignatureProfileListQuery =
  QueryParams<SignatureProfileListSortFields> & SignatureProfileListFilter;

export type ResSignatureProfileList = ResponseData<
  {
    SignatureProfileList: SignatureProfileModel[];
  },
  Pagination
>;

export type ResSignatureProfileDetail = ResponseData<
  { item: SignatureProfileModel },
  {}
>;

export type ResSignatureProfileModify = ResponseData<{}, {}>;
