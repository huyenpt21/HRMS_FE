import { Col, Row } from 'antd';
import BasicDateRangePicker from 'components/BasicDateRangePicker';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { DATE_TIME } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import { TimeCheckListQuery } from 'models/timeCheck';
import { Dispatch, SetStateAction } from 'react';
import { getStartEndDateFormat } from 'utils/common';
import BasicDatePicker from '../../../../components/BasicDatePicker';

interface IProps {
  menuType: MENU_TYPE;
  setStateQuery: Dispatch<SetStateAction<TimeCheckListQuery>>;
}
export default function ExtraTableTimeCheck({
  menuType,
  setStateQuery,
}: IProps) {
  const handleChangeDate = (_: any, dateString: string[]) => {
    const fromDate = getStartEndDateFormat(dateString[0], DATE_TIME);
    const endDate = getStartEndDateFormat(dateString[1], DATE_TIME);
    setStateQuery((prev: any) => ({
      ...prev,
      startDate: fromDate,
      endDate: endDate,
    }));
  };
  return (
    <>
      <div className="header__section">
        <div className="header__title">My Time Check</div>
      </div>
      <Row gutter={20}>
        {menuType === MENU_TYPE.MIME && (
          <Col span={6}>
            <BasicDateRangePicker
              label="Filter date"
              onChange={handleChangeDate}
              placeholder={['From', 'To']}
            />
          </Col>
        )}
        {menuType === MENU_TYPE.SUBORDINATE && (
          <>
            <Col span={6}>
              <InputDebounce
                suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
                placeholder="Search..."
                allowClear
                setStateQuery={setStateQuery}
                keyParam="search"
                label="Employee Name"
              />
            </Col>
            <Col span={5}>
              <BasicDatePicker label="Date" picker="week" />
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
