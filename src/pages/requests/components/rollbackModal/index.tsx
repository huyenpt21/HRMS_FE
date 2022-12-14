import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import BasicButton from 'components/BasicButton';
import CommonModal from 'components/CommonModal';
import Loading from 'components/loading';
import { STATUS } from 'constants/enums/common';
import styles from './rollbackModal.module.less';
interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  handleQickActionRequest: (status: string, requestId?: string) => void;
  requestStatus?: string;
  isLoading?: boolean;
}
export default function RollbackModal({
  isVisible,
  onCancel,
  handleQickActionRequest,
  requestStatus,
  isLoading,
}: IProps) {
  return (
    <CommonModal
      open={isVisible}
      onCancel={onCancel}
      footer={false}
      width={300}
      closeIcon={<CloseOutlined />}
    >
      <>
        {isLoading && <Loading text="Working on it..." />}
        {!isLoading && (
          <div className={styles.content}>
            <ExclamationCircleOutlined
              className={styles['content__icon--warning']}
            />
            <div className={styles.content__title}>
              Which status you want to rollback to?
            </div>
            <div className={styles.content__button}>
              {requestStatus === STATUS.REJECTED && (
                <BasicButton
                  title="Approve"
                  type="outline"
                  className={styles['btn--approve']}
                  onClick={() => {
                    handleQickActionRequest(STATUS.APPROVED);
                  }}
                />
              )}
              {requestStatus === STATUS.APPROVED && (
                <BasicButton
                  title="Reject"
                  type="outline"
                  className={`${styles['btn--reject']} `}
                  danger
                  onClick={() => {
                    handleQickActionRequest(STATUS.REJECTED);
                  }}
                />
              )}
              <BasicButton
                title="Pending"
                type="outline"
                className={`${styles['btn--pending']} `}
                danger
                onClick={() => {
                  handleQickActionRequest(STATUS.PENDING);
                }}
              />
            </div>
          </div>
        )}
      </>
    </CommonModal>
  );
}
