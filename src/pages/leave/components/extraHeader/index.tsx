import { Col, Row } from 'antd';
import BasicDatePicker from 'components/BasicDatePicker';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { YEAR_MONTH_NUM } from 'constants/common';
import { LeaveBudgetListQuery } from 'models/leaveBudget';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction } from 'react';
import styles from './extraHeaderEmployee.module.less';
interface IProps {
  setStateQuery: Dispatch<SetStateAction<LeaveBudgetListQuery>>;
  stateQuery?: LeaveBudgetListQuery;
}
export default function ExtraHeaderLeaveBudget({
  setStateQuery,
  stateQuery,
}: IProps) {
  return (
    <>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
            />
          </Col>
          {Number(stateQuery?.requestTypeId) !== 7 && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <BasicDatePicker
                defaultValue={moment()}
                picker="year"
                format="yyyy"
                placeholder="Filter year"
                onChange={(_: moment.Moment, dateString: string) =>
                  setStateQuery((prev: any) => ({ ...prev, year: dateString }))
                }
              />
            </Col>
          )}
          {Number(stateQuery?.requestTypeId) === 7 && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
              <BasicDatePicker
                picker="month"
                format={YEAR_MONTH_NUM}
                placeholder="Filter month"
                defaultValue={moment()}
                onChange={(value: moment.Moment) => {
                  setStateQuery((prev: any) => ({
                    ...prev,
                    month: value?.get('month') + 1,
                    year: value?.get('year'),
                  }));
                }}
              />
            </Col>
          )}
        </Row>
      </div>
    </>
  );
}
