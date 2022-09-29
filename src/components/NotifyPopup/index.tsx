import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import BasicButton from 'components/BasicButton';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

interface IProps {
  status: 'success' | 'warning' | 'error';
  title: string;
  message: string;
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
  const { t } = useTranslation();
  return (
    <Modal
      closeIcon={<></>}
      width={width}
      visible={visible}
      className={`mainModal ${className}`}
      footer={false}
      closable={closable}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      {status === 'success' && (
        <div className={styles.content}>
          <CheckCircleOutlined className={styles['content__icon--success']} />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton
              title={t('closeText')}
              type="outline"
              onClick={onCancel}
            />
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.content}>
          <ExclamationCircleOutlined
            className={styles['content__icon--error']}
          />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton
              title={t('cancelText')}
              type="outline"
              onClick={onCancel}
            />
            <BasicButton
              title={t('tryAgainText')}
              type="filled"
              onClick={onTryAgain}
            />
          </div>
        </div>
      )}
      {status === 'warning' && (
        <div className={styles.content}>
          <ExclamationCircleOutlined
            className={styles['content__icon--warning']}
          />
          <div className={styles.content__title}> {title} </div>
          <div className={styles.content__message}> {message} </div>
          <div className={styles.content__button}>
            <BasicButton
              title={t('cancelText')}
              type="outline"
              onClick={onCancel}
            />
            <BasicButton
              title={labelBtnDelete ?? t('confirmedDelete')}
              type="filled"
              onClick={onDelete}
              loading={loading}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
export default NotifyPopup;
