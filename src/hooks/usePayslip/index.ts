import { PAYSLIP } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import {
  PayslipFilter,
  ResPayslipDetail,
  ResPayslipModify,
  SercurityCode,
} from 'models/payslip';
import { useMutation, useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

export const useGetPayslip = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipDetail>) => {
  return useMutation(
    (payload: PayslipFilter) =>
      fetchApi(
        {
          url: `${PAYSLIP.service}`,
          options: {
            method: 'GET',
          },
          payload,
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
export const useCheckSecureCodeExist = () =>
  useQuery(['check-secure-code-exist'], () =>
    fetchApi(
      {
        url: PAYSLIP.model.secureCode,
      },
      undefined,
    ),
  );

export const useForgotSecureCodeExist = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipModify>) => {
  return useMutation(
    () =>
      fetchApi(
        {
          url: `${PAYSLIP.model.secureCode}/${PAYSLIP.model.forgot}`,
          options: {
            method: 'GET',
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
export const useCheckSecureCodeCorrectly = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipModify>) => {
  return useMutation(
    (body: SercurityCode) =>
      fetchApi(
        {
          url: `${PAYSLIP.model.secureCode}/${PAYSLIP.model.correct}`,
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

export const useCreateSecurityCode = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipModify>) => {
  return useMutation(
    (body: SercurityCode) =>
      fetchApi(
        {
          url: `${PAYSLIP.model.secureCode}`,
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

export const useUpdateSecurityCode = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipDetail>) => {
  return useMutation(
    (body: SercurityCode) =>
      fetchApi(
        {
          url: `${PAYSLIP.model.secureCode}`,
          options: {
            method: 'PUT',
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
export const useSendPayslipToEmail = ({
  onError,
  onSuccess,
}: MutationProps<ResPayslipModify>) => {
  return useMutation(
    (payload: PayslipFilter) =>
      fetchApi(
        {
          url: `${PAYSLIP.service}/${PAYSLIP.model.send}`,
          payload,
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
