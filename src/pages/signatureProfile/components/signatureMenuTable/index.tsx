import { notification, Tooltip } from 'antd';
import NotifyPopup from 'components/NotifyPopup';
import SvgIcon from 'components/SvgIcon';
import { MESSAGE_RES } from 'constants/common';
import { useDeleteSignature } from 'hooks/useSignatureProfile';
import {
  ResSignatureProfileModify,
  SignatureProfileModel,
} from 'models/signatureProfile';
import { useState } from 'react';
interface IProps {
  record: SignatureProfileModel;
  refetch: () => {};
}
export default function SignatureMenuTable({ record, refetch }: IProps) {
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const { mutate: deleteSignature, isLoading: loadingDelete } =
    useDeleteSignature({
      onSuccess: (response: ResSignatureProfileModify) => {
        const {
          metadata: { message },
        } = response;
        if (message === MESSAGE_RES.SUCCESS) {
          notification.success({
            message: 'Delete signature profile successfully',
          });
          refetch();
        }
        setIsShowConfirm(false);
      },
      onError: (response: ResSignatureProfileModify) => {
        const {
          metadata: { message },
        } = response;
        if (message) {
          notification.error({ message: message });
        }
        setIsShowConfirm(false);
      },
    });
  const menuActionHandler = (record: SignatureProfileModel) => {
    record?.registeredDate &&
      record?.personId &&
      deleteSignature({
        personId: record?.personId,
        registeredDate: record?.registeredDate,
      });
  };
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip title="Delete" placement="right">
        <span className="cursor-pointer" onClick={() => setIsShowConfirm(true)}>
          <SvgIcon icon="close-circle" />
        </span>
      </Tooltip>
      {isShowConfirm && (
        <NotifyPopup
          title="Are you sure to delete this signature profile?"
          message="This action cannot be reverse"
          onCancel={() => setIsShowConfirm(false)}
          onConfirm={() => menuActionHandler(record)}
          visible={isShowConfirm}
          isLoading={loadingDelete}
        />
      )}
    </div>
  );
}
