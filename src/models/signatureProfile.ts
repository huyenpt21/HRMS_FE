import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface SignatureProfileModel extends Resource {
  idSignature?: string;
  employeeName?: string;
  isRegistered?: number;
}

export interface SignatureProfileListFilter {
  search?: string;
  isRegister?: number;
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
