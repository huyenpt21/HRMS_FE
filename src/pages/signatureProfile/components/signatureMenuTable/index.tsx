import { Popconfirm, Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { SignatureProfileModel } from 'models/signatureProfile';
interface IProps {
  record: SignatureProfileModel;
  onClickMenu: (itemSelected: SignatureProfileModel) => void;
}
export default function SignatureMenuTable({ record, onClickMenu }: IProps) {
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {!!record?.isRegistered && (
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
