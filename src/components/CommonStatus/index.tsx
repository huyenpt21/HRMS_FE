import { STATUS } from 'constants/enums/common';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

interface IProps {
  type: STATUS.PENDING | STATUS.OPEN | STATUS.FAILED | STATUS.SUCCESS;
  text: string;
}
const CommonStatus = ({ type, text }: IProps) => {
  const { t } = useTranslation();
  let result;

  switch (type) {
    case STATUS.SUCCESS: {
      result = <span className={styles.success}>{t(text)}</span>;
      break;
    }
    case STATUS.FAILED: {
      result = <span className={styles.failed}>{t(text)}</span>;
      break;
    }
    case STATUS.OPEN: {
      result = <span className={styles.open}>{t(text)}</span>;
      break;
    }
    case STATUS.PENDING: {
      result = <span className={styles.pending}>{t(text)}</span>;
      break;
    }
  }
  return result;
};

export default CommonStatus;
