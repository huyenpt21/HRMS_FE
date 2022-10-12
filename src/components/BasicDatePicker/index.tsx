import { DatePicker, Form } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { DATE_REQUEST, US_DATE_FORMAT } from 'constants/common';
import moment from 'moment';
import { useState } from 'react';
import styles from './index.module.less';

interface Props {
  name?: string;
  colon?: boolean;
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
  placeholder?: string;
}

const BasicDatePicker = ({
  label,
  colon,
  name,
  rules,
  classNameFormItem,
  initialValueForm,
  defaultValue,
  disabled,
  isUseDefaultValue,
  onChangeHandle,
  disabledDate,
  picker,
  placeholder,
}: Props) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;

  const [value, setValue] = useState(
    isUseDefaultValue ? () => moment(defaultValue, DATE_REQUEST) : undefined,
  );
  return (
    <Form.Item
      label={label ? label : ''}
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
        format={US_DATE_FORMAT}
        onChange={(e: any) => {
          setValue(e);
          onChangeHandle(e);
        }}
        disabled={disabled}
        disabledDate={disabledDate}
        picker={picker}
        placeholder={placeholder ? placeholder : US_DATE_FORMAT}
        suffixIcon={<SvgIcon icon="calendar-search" size={20} color="#aaa" />}
      />
    </Form.Item>
  );
};
export default BasicDatePicker;
