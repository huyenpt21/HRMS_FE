import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import BasicButton from 'components/BasicButton';
import styles from './index.module.less';

interface IProps {
  status: 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  visible: boolean;
  className?: string;
  closable?: boolean;
  width?: string | number;
  onCancel: () => void;
  afterClose?: () => void;
  onTryAgain?: () => void;
  onDelete: () => void;
  labelBtnDelete?: string;
  loading?: boolean;
}
const NotifyPopup = ({
  status,
  title,
  message,
  visible,
  width,
  onCancel,
  afterClose,
  className,
  closable,
  onTryAgain,
  onDelete,
  labelBtnDelete,
  loading,
}: IProps) => {
  return (
    <Modal
      closeIcon={<></>}
      width={width ?? 350}
      visible={visible}
      className={`mainModal ${className}`}
      footer={false}
      closable={closable}
      onCancel={onCancel}
      afterClose={afterClose}
      centered
    >
      {status === 'success' && (
        <div className={styles.content}>
          <CheckCircleOutlined
            className={`${styles.icon} ${styles['icon--success']}`}
          />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton title={'Close'} type="outline" onClick={onCancel} />
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.content}>
          <ExclamationCircleOutlined
            className={`${styles.icon} ${styles['icon--error']}`}
          />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton title={'Cancel'} type="outline" onClick={onCancel} />
            <BasicButton
              title={'Try again'}
              type="filled"
              onClick={onTryAgain}
            />
          </div>
        </div>
      )}
      {status === 'warning' && (
        <div className={styles.content}>
          <ExclamationCircleOutlined
            className={`${styles.icon} ${styles['icon--warning']}`}
          />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton title={'Cancel'} type="outline" onClick={onCancel} />
            <BasicButton
              title={labelBtnDelete ?? 'Delete'}
              type="filled"
              onClick={onDelete}
              loading={loading}
              danger
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
export default NotifyPopup;
