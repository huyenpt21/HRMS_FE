import { DatePicker, Form } from 'antd';
import SvgIcon from 'components/SvgIcon';
import { DATE_REQUEST, US_DATE_FORMAT } from 'constants/common';
import moment from 'moment';
import styles from './index.module.less';

interface Props {
  name?: string;
  colon?: boolean;
  label?: string;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  defaultValue?: string;
  disabled?: boolean;
  onChange?: any;
  disabledDate?: (currentDate: moment.Moment) => boolean;
  picker?: 'week' | 'month' | 'quarter' | 'year';
  placeholder?: string;
  allowClear?: boolean;
  format?: string;
}

const BasicDatePicker = ({
  label,
  colon,
  name,
  rules,
  classNameFormItem,
  defaultValue,
  disabled,
  onChange,
  disabledDate,
  picker,
  placeholder,
  allowClear,
  format,
}: Props) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;

  return (
    <Form.Item
      label={label ? label : ''}
      colon={colon || false}
      name={name}
      required={isRequired}
      rules={rules}
      className={classNameFormItem}
      initialValue={
        defaultValue ? moment(defaultValue, DATE_REQUEST) : undefined
      }
    >
      <DatePicker
        className={styles.date__picker}
        size={'large'}
        defaultValue={
          defaultValue ? moment(defaultValue, DATE_REQUEST) : undefined
        }
        format={format ?? US_DATE_FORMAT}
        onChange={onChange}
        disabled={disabled}
        disabledDate={disabledDate}
        picker={picker}
        placeholder={placeholder ? placeholder : US_DATE_FORMAT}
        suffixIcon={<SvgIcon icon="calendar-search" size={20} color="#aaa" />}
        allowClear={allowClear ?? true}
      />
    </Form.Item>
  );
};
export default BasicDatePicker;
