import { Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { REQUEST_ACTION_TYPE, TAB_REQUEST_TYPE } from 'constants/enums/common';
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
      {tabType === TAB_REQUEST_TYPE.SUBORDINATE && (
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
      {tabType === TAB_REQUEST_TYPE.MY_REQUEST && (
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
          <Tooltip title="Cancel">
            <span
              onClick={() =>
                actionRequestHandler(record.id, REQUEST_ACTION_TYPE.CANCEL)
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
