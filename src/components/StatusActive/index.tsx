import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

type Props = {
  status: boolean;
};

const StatusActive = ({ status }: Props) => {
  const { t } = useTranslation();
  return (
    <div className={`${status ? styles.active : styles.Inactive}`}>
      {status ? t('buttonActive') : t('buttonInActive')}
    </div>
  );
};

export default StatusActive;
