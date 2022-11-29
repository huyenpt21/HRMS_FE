import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_HMS, TIME_HOUR } from 'constants/common';
import { useState } from 'react';

interface TimeComponentProps {
  name: string;
  useLabel?: boolean;
  label?: string;
  rules?: object[];
  className?: string;
  classNameFormItem?: string;
  defaultValue?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

const TimeComponent = ({
  name,
  useLabel,
  label,
  rules,
  className,
  classNameFormItem,
  defaultValue,
  disabled,
  allowClear,
}: TimeComponentProps) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;
  const [value, setValue] = useState(
    defaultValue ? () => moment(defaultValue, TIME_HMS) : undefined,
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
        onChange={(e: any) => setValue(e)}
        disabled={disabled}
        allowClear={allowClear}
      />
    </Form.Item>
  );
};

export default TimeComponent;
