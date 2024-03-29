import { ConfigProvider, DatePicker, Form } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { US_DATE_FORMAT } from 'constants/common';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import styles from './index.module.less';
import locale from 'antd/es/locale/vi_VN';
export type RangeValue = [moment.Moment | null, moment.Moment | null] | null;
type EventValue<DateType> = DateType | null;
type RangeType = 'start' | 'end';
type DisabledTimes = {
  disabledHours?: (() => number[]) | undefined;
  disabledMinutes?: ((hour: number) => number[]) | undefined;
  disabledSeconds?: ((hour: number, minute: number) => number[]) | undefined;
};
interface IProps {
  label?: string;
  rules?: object[];
  name?: string;
  colon?: boolean;
  isUseDefaultValue?: boolean;
  defaultStartDate?: string;
  defaultEndDate?: string;
  setStateQuery?: Dispatch<SetStateAction<any>>;
  onChange?: any;
  className?: string;
  disabled?: boolean;
  disabledDate?: (currentDate: moment.Moment) => boolean;
  placeholder?: [string, string];
  showTime?: any;
  format?: string;
  onCalendarChange?: (
    values: RangeValue,
    formatString: [string, string],
    info: { range: string },
  ) => void;
  allowClear?: boolean;
  disabledTime?: (
    date: EventValue<moment.Moment>,
    type: RangeType,
  ) => DisabledTimes;
  hideDisabledOptions?: boolean;
  inputReadOnly?: boolean;
}

const { RangePicker } = DatePicker;

const BasicDateRangePicker = (props: IProps) => {
  moment.locale('vi', {
    week: {
      dow: 1, // Date offset
    },
  });
  const isRequired = props.rules
    ? props.rules.filter((r: any) => r.required === true).length > 0
    : false;

  const defaultDate = props.isUseDefaultValue
    ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
    : undefined;
  return (
    <span className={styles['picker--container']}>
      <ConfigProvider locale={locale}>
        <Form.Item
          label={props.label ? props.label : ''}
          colon={props.colon || false}
          name={props.name}
          required={isRequired}
          rules={props.rules}
          initialValue={defaultDate}
        >
          <RangePicker
            className={`${styles['header__time']} ${props.className}`}
            format={props.format ? props.format : US_DATE_FORMAT}
            defaultValue={
              props.isUseDefaultValue
                ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
                : undefined
            }
            onChange={props.onChange}
            suffixIcon={
              <SvgIcon icon="calendar-search" size={20} color="#aaa" />
            }
            size="large"
            disabled={props.disabled}
            disabledDate={props.disabledDate}
            placeholder={props.placeholder}
            showTime={props.showTime}
            onCalendarChange={props.onCalendarChange}
            allowClear={props.allowClear}
            disabledTime={props.disabledTime}
            hideDisabledOptions={props.hideDisabledOptions}
            inputReadOnly={props.inputReadOnly}
          />
        </Form.Item>
      </ConfigProvider>
    </span>
  );
};

export default BasicDateRangePicker;
