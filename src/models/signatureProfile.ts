import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface SignatureProfileModel extends Resource {
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
  personId?: number;
}

export type SignatureProfileListSortFields = 'personName';

export type SignatureProfileListQuery =
  QueryParams<SignatureProfileListSortFields> & SignatureProfileListFilter;

export type ResSignatureProfileList = ResponseData<
  {
    item: SignatureProfileModel[];
  },
  Pagination
>;

export type ResSignatureProfileDetail = ResponseData<
  { item: SignatureProfileModel },
  {}
>;

export type ResSignatureProfileModify = ResponseData<{}, {}>;
