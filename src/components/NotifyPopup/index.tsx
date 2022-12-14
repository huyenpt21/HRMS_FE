import { ExclamationCircleOutlined } from '@ant-design/icons';
import BasicButton from 'components/BasicButton';
import CommonModal from 'components/CommonModal';
import Loading from 'components/loading';
import styles from './index.module.less';

interface IProps {
  title: string;
  message?: string;
  visible: boolean;
  width?: string | number;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
const NotifyPopup = ({
  title,
  message,
  visible,
  width,
  onCancel,
  onConfirm,
  isLoading,
}: IProps) => {
  return (
    <CommonModal
      closeIcon={<></>}
      width={width ?? 350}
      open={visible}
      footer={false}
      onCancel={onCancel}
    >
      <>
        {isLoading && <Loading text="Working on it..." />}
        {!isLoading && (
          <div className={styles.content}>
            <ExclamationCircleOutlined
              className={`${styles.icon} ${styles['icon--warning']}`}
            />
            <div className={styles.content__title}> {title} </div>
            <div className={styles.content__message}> {message} </div>
            <div className={styles.content__button}>
              <BasicButton
                title={'No'}
                type="outline"
                onClick={onCancel}
                className={styles.btn__no}
              />
              <BasicButton
                title={'Yes'}
                type="outline"
                onClick={onConfirm}
                className={styles.btn__yes}
              />
            </div>
          </div>
        )}
      </>
    </CommonModal>
  );
};
export default NotifyPopup;
