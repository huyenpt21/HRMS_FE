import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_HOUR } from 'constants/common';
import styles from './index.module.less';

interface TimeComponentProps {
  name: string;
  useLabel?: boolean;
  label?: string;
  rules?: object[];
  className?: string;
  classNameFormItem?: string;
  isUseDefaultValue?: boolean;
  disabled?: boolean;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onChange?: (e: any) => void;
  disableTime?: () => {};
}

const TimeRangePicker = ({
  name,
  useLabel,
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
        label={useLabel ? label : ''}
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
        />
      </Form.Item>
    </span>
  );
};

export default TimeRangePicker;
