import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { REQUEST_ACTION_TYPE, REQUEST_MENU } from 'constants/enums/common';
import { RequestModel } from 'models/request';
interface IProps {
  tabType: string;
  record: RequestModel;
}
export default function RequestMenuAction({ tabType, record }: IProps) {
  const actionRequestHandler = (
    requestId: number,
    requestType: REQUEST_ACTION_TYPE,
  ) => {};
  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {tabType === REQUEST_MENU.SUBORDINATE && (
        <>
          <Tooltip title="Approve">
            <span
              onClick={() =>
                actionRequestHandler(record.id, REQUEST_ACTION_TYPE.APPROVE)
              }
              className="cursor-pointer"
            >
              <SvgIcon icon="accept-circle" />
            </span>
          </Tooltip>
          <Tooltip title="Reject">
            <span
              onClick={() =>
                actionRequestHandler(record.id, REQUEST_ACTION_TYPE.REJECT)
              }
              className="cursor-pointer"
            >
              <SvgIcon icon="close-circle" />
            </span>
          </Tooltip>
        </>
      )}
      {tabType === REQUEST_MENU.MY_REQUEST && (
        <>
          <Tooltip title="Edit">
            <span
              onClick={() =>
                actionRequestHandler(record.id, REQUEST_ACTION_TYPE.EDIT)
              }
              className="cursor-pointer"
            >
              <SvgIcon icon="edit-border" />
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              onClick={() =>
                actionRequestHandler(record.id, REQUEST_ACTION_TYPE.DELETE)
              }
              className="cursor-pointer"
            >
              <SvgIcon icon="close-circle" />
            </span>
          </Tooltip>
        </>
      )}
    </div>
  );
}
