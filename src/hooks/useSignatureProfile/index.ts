import { SIGNATURE_PROFILE } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import {
  ResSignatureProfileModify,
  SignatureProfileListQuery,
} from 'models/signatureProfile';
import { useMutation, useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useGteSignatureList = (payload: SignatureProfileListQuery) =>
  useQuery(['get-signature-profile-list'], () =>
    fetchApi(
      {
        url: SIGNATURE_PROFILE.service,
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
    (id: string) =>
      fetchApi(
        {
          url: `${SIGNATURE_PROFILE.service}/${id}`,
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
