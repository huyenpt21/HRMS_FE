import { Popconfirm, Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { SignatureProfileModel } from 'models/signatureProfile';
import { Dispatch, SetStateAction } from 'react';
interface IProps {
  record: SignatureProfileModel;
  onClickMenu: (itemSelected: SignatureProfileModel) => void;
  setIsShowDetailModal?: Dispatch<SetStateAction<any>>;
}
export default function SignatureMenuTable({
  record,
  onClickMenu,
  setIsShowDetailModal,
}: IProps) {
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {!record.isRegistered && (
        <Tooltip title="Register" placement="right">
          <span
            onClick={() => {
              setIsShowDetailModal && setIsShowDetailModal(true);
            }}
            className="cursor-pointer"
          >
            <SvgIcon icon="tag" />
          </span>
        </Tooltip>
      )}
      {!!record.isRegistered && (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => onClickMenu(record)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete" placement="right">
            <span className="cursor-pointer">
              <SvgIcon icon="close-circle" />
            </span>
          </Tooltip>
        </Popconfirm>
      )}
    </div>
  );
}
