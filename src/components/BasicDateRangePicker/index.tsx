import { DatePicker, Form } from 'antd';
import { US_DATE_FORMAT } from 'constants/common';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import styles from './index.module.less';

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
  isConvertToUTC?: boolean;
  placeholder?: [string, string];
}

const { RangePicker } = DatePicker;

const BasicDateRangePicker = (props: IProps) => {
  const isRequired = props.rules
    ? props.rules.filter((r: any) => r.required === true).length > 0
    : false;

  const defaultDate = props.isUseDefaultValue
    ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
    : undefined;
  return (
    <span className={styles['picker--container']}>
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
          format={US_DATE_FORMAT}
          defaultValue={
            props.isUseDefaultValue
              ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
              : undefined
          }
          onChange={props.onChange}
          suffixIcon={null}
          size="large"
          disabled={props.disabled}
          disabledDate={props.disabledDate}
          placeholder={props.placeholder}
        />
      </Form.Item>
    </span>
  );
};

export default BasicDateRangePicker;
