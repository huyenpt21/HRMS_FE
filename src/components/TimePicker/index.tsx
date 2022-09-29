import { Form, TimePicker } from 'antd';
import moment from 'moment';
import { TIME_HOUR } from 'constants/common';
import { useState } from 'react';

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
        onChange={(e: any) => setValue(e)}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default TimeComponent;
