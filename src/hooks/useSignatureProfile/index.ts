import { SIGNATURE_PROFILE } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import {
  ResSignatureProfileModify,
  SignatureProfileListQuery,
  SignatureRegister,
} from 'models/signatureProfile';
import { useMutation, useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

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
    (id: number) =>
      fetchApi(
        {
          url: `${SIGNATURE_PROFILE.model.hr}/${SIGNATURE_PROFILE.service}/${id}`,
          options: {
            method: 'DELETE',
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
