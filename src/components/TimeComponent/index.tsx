import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_HOUR } from 'constants/common';
import { useState } from 'react';
import { DisableTime } from 'models/common';

interface TimeComponentProps {
  name: string;
  useLabel?: boolean;
  label?: string;
  rules?: object[];
  className?: string;
  classNameFormItem?: string;
  isUseDefaultValue?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  disableTime?: () => DisableTime;
}

const TimeComponent = ({
  name,
  useLabel,
  label,
  rules,
  className,
  classNameFormItem,
  isUseDefaultValue,
  defaultValue,
  disabled,
  onChange,
  disableTime,
}: TimeComponentProps) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;
  const [value, setValue] = useState(
    isUseDefaultValue ? () => moment(defaultValue, TIME_HOUR) : undefined,
  );
  return (
    <Form.Item
      name={name}
      initialValue={value}
      label={useLabel ? label : ''}
      rules={rules}
      required={isRequired}
      className={classNameFormItem}
    >
      <TimePicker
        className={className}
        format={TIME_HOUR}
        size="large"
        onChange={(e: any) => {
          setValue(e);
          onChange && onChange(e);
        }}
        disabled={disabled}
        disabledTime={disableTime}
      />
    </Form.Item>
  );
};

export default TimeComponent;
