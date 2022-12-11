import { Col, Row } from 'antd';
import { DATE_TIME_US } from 'constants/common';
import { STATUS } from 'constants/enums/common';
import { RequestModel } from 'models/request';
import { getDateFormat } from 'utils/common';
import styles from '../../detailModal/requestDetailModal.module.less';
import RequestStatus from '../statusRequest';
interface IPops {
  requestData?: RequestModel;
}
export default function FixDataHeaderRequest({ requestData }: IPops) {
  return (
    <>
      <Row gutter={20} className={styles['infor--header']}>
        <Col span={10}>
          <span>Created By:</span>
          <span className={styles['text--bold']}>
            {requestData?.personName}
          </span>
        </Col>
        <Col span={6}>
          <span>Roll Number:</span>
          <span className={styles['text--bold']}>
            {requestData?.rollNumber}
          </span>
        </Col>
        <Col span={8}>
          <span>Created Time:</span>
          <span className={styles['text--bold']}>
            {getDateFormat(requestData?.createDate, DATE_TIME_US)}
          </span>
        </Col>
      </Row>
      <Row gutter={20} className={styles['infor--header']}>
        <Col span={10}>
          <span>
            {requestData?.status === STATUS.APPROVED
              ? 'Appoval By:'
              : 'Receiver:'}
          </span>
          <span className={styles['text--bold']}>{requestData?.receiver}</span>
        </Col>
        <Col span={6}>
          <span>Status:</span>{' '}
          <RequestStatus data={requestData?.status ?? ''} />
        </Col>
        {!!requestData?.approvalDate && (
          <Col span={8}>
            <span>Approved Time:</span>
            <span className={styles['text--bold']}>
              {getDateFormat(requestData?.approvalDate, DATE_TIME_US)}
            </span>
          </Col>
        )}
      </Row>
    </>
  );
}
