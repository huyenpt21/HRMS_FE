import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './ContentPage.module.less';

export default function ContentPage() {
  return (
    <div className={styles.container}>
      <Outlet />
    </div>
  );
}
