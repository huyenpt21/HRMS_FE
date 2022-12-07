import { REQUEST_MENU, REQUEST_TYPE_KEY } from 'constants/enums/common';
import { RequestRemainingTime } from 'models/request';
import React from 'react';
import styles from '../../detailModal/requestDetailModal.module.less';
interface IProps {
  remainingTimeRef: RequestRemainingTime | undefined;
  requestType: string | undefined;
  tabType: string | undefined;
}
export default function NoticeRemainingTime({
  remainingTimeRef,
  requestType,
  tabType,
}: IProps) {
  if (tabType === REQUEST_MENU.MY_REQUEST) {
    return (
      <>
        {remainingTimeRef?.timeRemaining === 0 &&
          requestType === REQUEST_TYPE_KEY.LEAVE && (
            <div className={styles.notice}>
              * Notice: You have used up all the holidays this year
            </div>
          )}
        {requestType === REQUEST_TYPE_KEY.OT && (
          <>
            {remainingTimeRef?.otTimeRemainingOfYear === 0 && (
              <div className={styles.notice}>
                * Notice: You have used up all the over time this year
              </div>
            )}
            {remainingTimeRef?.otTimeRemainingOfMonth === 0 && (
              <div className={styles.notice}>
                * Notice: You have used up all the over time this month
              </div>
            )}
          </>
        )}
      </>
    );
  }
  return (
    <>
      {remainingTimeRef?.timeRemaining === 0 &&
        requestType === REQUEST_TYPE_KEY.LEAVE && (
          <div className={styles.notice}>
            * Notice: This person have used up all the holidays this year
          </div>
        )}
      {requestType === REQUEST_TYPE_KEY.OT && (
        <>
          {remainingTimeRef?.otTimeRemainingOfYear === 0 && (
            <div className={styles.notice}>
              * Notice: This person have used up all the over time this year
            </div>
          )}
          {remainingTimeRef?.otTimeRemainingOfMonth === 0 && (
            <div className={styles.notice}>
              * Notice: This person have used up all the over time this month
            </div>
          )}
        </>
      )}
    </>
  );
}
