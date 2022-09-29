import { DatePicker, Form } from 'antd';
import { DATE_DISPLAY, DATE_DMY } from 'constants/common';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { convertToDateUtc } from 'utils/common';
import styles from './index.module.less';

interface IProps {
  label?: string;
  rules?: object[];
  name?: string;
  colon?: boolean;
  useLabel?: boolean;
  isUseDefaultValue?: boolean;
  defaultStartDate?: string;
  defaultEndDate?: string;
  setStateQuery?: Dispatch<SetStateAction<any>>;
  onChange?: any;
  className?: string;
  disabled?: boolean;
  disabledDate?: (currentDate: moment.Moment) => boolean;
  isConvertToUTC?: boolean;
}

const { RangePicker } = DatePicker;

const BasicDateRangePicker = (props: IProps) => {
  const isRequired = props.rules
    ? props.rules.filter((r: any) => r.required === true).length > 0
    : false;

  const getDateHandler = (_: any, formatString: [string, string]) => {
    let [from, to] = formatString;
    submitDate(`${from} - ${to}`);
  };

  const submitDate = (value: string) => {
    const [fromDate, toDate] = value.split(' - ');

    if (props.setStateQuery) {
      props.setStateQuery((prev: any) => ({
        ...prev,
        fromDate: !props.isConvertToUTC
          ? moment(fromDate, DATE_DMY).format()
          : convertToDateUtc(fromDate, true, DATE_DISPLAY),
        toDate: !props.isConvertToUTC
          ? moment(toDate, DATE_DMY).format()
          : convertToDateUtc(toDate, false, DATE_DISPLAY),
      }));
    }
  };

  const defaultDate = props.isUseDefaultValue
    ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
    : undefined;
  return (
    <span className={styles['picker--container']}>
      <Form.Item
        label={props.useLabel ? props.label : ''}
        colon={props.colon || false}
        name={props.name}
        required={isRequired}
        rules={props.rules}
        initialValue={defaultDate}
      >
        <RangePicker
          className={`${styles['header__time']} ${props.className}`}
          format={DATE_DISPLAY}
          defaultValue={
            props.isUseDefaultValue
              ? [moment(props.defaultStartDate), moment(props.defaultEndDate)]
              : undefined
          }
          onChange={props.onChange ?? getDateHandler}
          suffixIcon={null}
          size="large"
          disabled={props.disabled}
          disabledDate={props.disabledDate}
        />
      </Form.Item>
    </span>
  );
};

export default BasicDateRangePicker;
