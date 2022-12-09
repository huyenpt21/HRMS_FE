import { SIGNATURE_PROFILE } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
} from 'hooks/useCustomQuery';
import {
  ResSignatureProfileModify,
  SignatureProfileListQuery,
  SignatureProfileListSortFields,
  SignatureRegister,
  SignatureProfileModel,
  ResSignatureProfileList,
  ResSignatureProfileDetail,
} from 'models/signatureProfile';
import { useMutation, useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

class RequestList implements Feature<SignatureProfileListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const SignatureListInstance = new RequestList(
  `${SIGNATURE_PROFILE.model.hr}/${SIGNATURE_PROFILE.service}`,
  undefined,
  'get-signature-list',
);

export const {
  useList: useSignatureList,
  useItem: useSignatureDetail,
  useAddItemModal: useAddSignatureModal,
  useUpdateItem: useUpdateSignature,
} = initialCustomQuery<
  SignatureProfileModel,
  ResSignatureProfileList,
  ResSignatureProfileDetail,
  ResSignatureProfileModify,
  SignatureProfileListQuery
>(SignatureListInstance);

export const useGteSignatureList = (payload: SignatureProfileListQuery) =>
  useQuery(['get-signature-profile-list'], () =>
    fetchApi(
      {
        url: `${SIGNATURE_PROFILE.model.hr}/${SIGNATURE_PROFILE.service}`,
        payload,
      },
      undefined,
    ),
  );

export const useDeleteSignature = ({
  onError,
  onSuccess,
}: MutationProps<ResSignatureProfileModify>) => {
  return useMutation(
    (body: { personId: number; registeredDate: string }) =>
      fetchApi(
        {
          url: `${SIGNATURE_PROFILE.model.hr}/${SIGNATURE_PROFILE.service}`,
          options: {
            method: 'DELETE',
            body: JSON.stringify(body),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
export const useRegisterSignature = ({
  onSuccess,
  onError,
}: MutationProps<ResSignatureProfileModify>) => {
  return useMutation(
    (body: SignatureRegister) =>
      fetchApi(
        {
          url: `${SIGNATURE_PROFILE.model.hr}/${SIGNATURE_PROFILE.service}`,
          options: {
            method: 'POST',
            body: JSON.stringify(body),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
