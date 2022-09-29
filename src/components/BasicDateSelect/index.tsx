import { DatePicker, Form } from 'antd';
import { DATE_DISPLAY, DATE_REQUEST } from 'constants/common';
import moment from 'moment';
import { useState } from 'react';
import styles from './index.module.less';

interface Props {
  name?: string;
  colon?: boolean;
  useLabel?: boolean;
  label?: string;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  initialValueForm?: string;
  isUseDefaultValue?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  onChangeHandle?: any;
  disabledDate?: (currentDate: moment.Moment) => boolean;
  picker?: 'week' | 'month' | 'quarter' | 'year';
}

const BasicDatePicker = ({
  label,
  colon,
  name,
  rules,
  classNameFormItem,
  useLabel,
  initialValueForm,
  defaultValue,
  disabled,
  isUseDefaultValue,
  onChangeHandle,
  disabledDate,
  picker,
}: Props) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;

  const [value, setValue] = useState(
    isUseDefaultValue ? () => moment(defaultValue, DATE_REQUEST) : undefined,
  );
  return (
    <Form.Item
      label={useLabel ? label : ''}
      colon={colon || false}
      name={name}
      required={isRequired}
      rules={rules}
      className={classNameFormItem}
      initialValue={value}
    >
      <DatePicker
        className={styles.date__picker}
        size={'large'}
        defaultValue={value}
        format={DATE_DISPLAY}
        onChange={(e: any) => {
          setValue(e);
          onChangeHandle(e);
        }}
        disabled={disabled}
        disabledDate={disabledDate}
        picker={picker}
      />
    </Form.Item>
  );
};
export default BasicDatePicker;
