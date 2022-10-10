import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './contentPage.module.less';

export default function ContentPage() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}
