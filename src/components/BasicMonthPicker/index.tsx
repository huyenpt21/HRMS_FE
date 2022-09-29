import { DatePicker, Form } from 'antd';
import { PICKER_TYPE, SIZE_TYPE } from 'constants/enums/common';
import moment from 'moment-timezone';
import styles from './index.module.less';

interface IProps {
  name?: string;
  colon?: boolean;
  useLabel?: boolean;
  label?: string;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  initialValueForm?: moment.Moment;
  defaultValue?: moment.Moment;
  disabled?: boolean;
  onChange?: any;
  picker?: PICKER_TYPE;
  format?: string;
  disabledDate?: (date: moment.Moment) => boolean;
  size?: SIZE_TYPE;
}

const BasicMonthPicker = ({
  label,
  colon,
  name,
  rules,
  classNameFormItem,
  useLabel,
  initialValueForm,
  defaultValue,
  disabled,
  onChange,
  picker,
  format,
  disabledDate,
  size,
}: IProps) => {
  const isRequired = rules
    ? rules.filter((r: any) => r.required === true).length > 0
    : false;
  return (
    <Form.Item
      label={useLabel ? label : ''}
      colon={colon || false}
      name={name}
      required={isRequired}
      rules={rules}
      className={classNameFormItem}
      initialValue={initialValueForm}
    >
      <DatePicker
        className={styles.date__picker}
        name="expirationStandardMonth"
        disabled={disabled}
        picker={picker}
        size={size ? size : 'large'}
        defaultValue={defaultValue}
        format={format}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default BasicMonthPicker;
