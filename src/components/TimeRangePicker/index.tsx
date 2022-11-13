import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_HOUR } from 'constants/common';
import styles from './index.module.less';

type EventValue<DateType> = DateType | null;
type RangeType = 'start' | 'end';
type DisabledTimes = {
  disabledHours?: (() => number[]) | undefined;
  disabledMinutes?: ((hour: number) => number[]) | undefined;
  disabledSeconds?: ((hour: number, minute: number) => number[]) | undefined;
};
interface TimeComponentProps {
  name: string;
  label?: string;
  rules?: object[];
  className?: string;
  classNameFormItem?: string;
  isUseDefaultValue?: boolean;
  disabled?: boolean;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onChange?: (e: any) => void;
  disableTime?: (
    date: EventValue<moment.Moment>,
    type: RangeType,
  ) => DisabledTimes;
  placeholder?: [string, string];
  hideDisabledOptions?: boolean;
}

const TimeRangePicker = ({
  name,
  label,
  rules,
  className,
  classNameFormItem,
  isUseDefaultValue,
  disabled,
  defaultStartTime,
  defaultEndTime,
  onChange,
  disableTime,
  placeholder,
  hideDisabledOptions,
}: TimeComponentProps) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;

  return (
    <span className={styles['picker--container']}>
      <Form.Item
        name={name}
        initialValue={
          isUseDefaultValue
            ? [moment(defaultStartTime), moment(defaultEndTime)]
            : undefined
        }
        label={label ? label : ''}
        rules={rules}
        required={isRequired}
        className={classNameFormItem}
      >
        <TimePicker.RangePicker
          className={className}
          format={TIME_HOUR}
          size="large"
          disabled={disabled}
          onChange={onChange}
          disabledTime={disableTime}
          suffixIcon={null}
          placeholder={placeholder}
          hideDisabledOptions={hideDisabledOptions}
        />
      </Form.Item>
    </span>
  );
};

export default TimeRangePicker;
