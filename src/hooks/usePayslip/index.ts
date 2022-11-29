import { PAYSLIP } from 'constants/services';
import { MutationProps, successHandler } from 'hooks/useCustomQuery';
import { PayslipFilter, ResPayslipDetail } from 'models/payslip';
import { useMutation } from 'react-query';
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
