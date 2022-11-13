import { notification, Tooltip } from 'antd';
import SvgIcon from 'components/SvgIcon';
import {
  ACTION_TYPE,
  REQUEST_ACTION_TYPE,
  REQUEST_MENU,
  STATUS,
} from 'constants/enums/common';
import { useChangeStatusRequest, useDeleteRequest } from 'hooks/useRequestList';
import {
  RequestListQuery,
  RequestModel,
  ResRequestModify,
} from 'models/request';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useState,
  useRef,
} from 'react';
import RollbackModal from '../rollbackModal';

interface IProps {
  tabType: string;
  record: RequestModel;
  setIsShowDetailModal?: Dispatch<SetStateAction<boolean>>;
  modalAction?: MutableRefObject<ACTION_TYPE>;
  requestIdRef?: MutableRefObject<number>;
  stateQuery?: RequestListQuery;
  refetchList: () => void;
  requestStatus?: string;
}
export default function RequestMenuAction({
  tabType,
  record,
  setIsShowDetailModal,
  modalAction,
  requestIdRef,
  stateQuery,
  refetchList,
  requestStatus,
}: IProps) {
  const [isShowRollbackModal, setIsShowRollbackModal] = useState(false);
  const requestIdRefInternal = useRef<number>();

  const { mutate: statusRequest } = useChangeStatusRequest({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === 'Success') {
        notification.success({
          message: 'Responding request successfully',
        });
        refetchList();
      }
    },
  });
  const { mutate: deleteRequest } = useDeleteRequest({
    onSuccess: (response: ResRequestModify) => {
      const {
        metadata: { message },
      } = response;
      if (message === 'Success') {
        notification.success({
          message: 'Delete request successfully',
        });
        refetchList();
      }
    },
  });
  const actionRequestHandler = (
    requestId: number,
    requestType: REQUEST_ACTION_TYPE,
  ) => {
    switch (requestType) {
      case REQUEST_ACTION_TYPE.APPROVE: {
        statusRequest({ uid: requestId, body: { status: STATUS.APPROVED } });
        break;
      }
      case REQUEST_ACTION_TYPE.REJECT: {
        statusRequest({ uid: requestId, body: { status: STATUS.REJECTED } });
        break;
      }
      case REQUEST_ACTION_TYPE.EDIT: {
        if (modalAction) modalAction.current = ACTION_TYPE.EDIT;
        if (requestIdRef) requestIdRef.current = requestId;
        setIsShowDetailModal && setIsShowDetailModal(true);
        break;
      }
      case REQUEST_ACTION_TYPE.DELETE: {
        stateQuery &&
          deleteRequest({ uid: requestId, currentFilter: stateQuery });
        break;
      }
    }
  };

  const handleRollback = (status: string) => {
    statusRequest({
      uid: requestIdRefInternal.current,
      body: { status: status },
    });
    setIsShowRollbackModal(false);
  };

  return (
    <div
      className="menu-action"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {tabType === REQUEST_MENU.SUBORDINATE && (
        <>
          {requestStatus === STATUS.PENDING && (
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
          {requestStatus !== STATUS.PENDING && !!record.isAllowRollback && (
            <Tooltip title="Rollback">
              <span
                onClick={() => {
                  setIsShowRollbackModal(true);
                  requestIdRefInternal.current = record.id;
                }}
                className="cursor-pointer"
              >
                <SvgIcon icon="reset" />
              </span>
            </Tooltip>
          )}
          {requestStatus !== STATUS.PENDING && !record.isAllowRollback && '-'}
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
      <RollbackModal
        isVisible={isShowRollbackModal}
        handleQickActionRequest={handleRollback}
        onCancel={() => setIsShowRollbackModal(false)}
        requestStatus={record?.status}
      />
    </div>
  );
}
