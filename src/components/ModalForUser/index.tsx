import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';

type Props = {};

const ModalForUser = (props: Props) => {
  const { t } = useTranslation();
  return <div className={styles.container}>{t('msgNotPermission')}</div>;
};

export default ModalForUser;
