import { CalendarOutlined } from '@ant-design/icons';
import { Calendar, Form, Select, Tag } from 'antd';
import { TIME_DAY } from 'constants/common';
import moment, { Moment } from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { convertToDateUtc } from 'utils/common';
import styles from './index.module.less';

interface Props {
  value: string[];
  setValue: any;
  size?: 'large' | 'middle' | 'small';
  onChange?: (e: Moment) => void;
  className?: string;
  allowClear?: boolean;
  name?: string;
  useLabel?: boolean;
  label?: string;
  handleAddDate?: (value: string) => void;
  handleDeteteDate?: (value: string) => void;
  rules?: object[];
  disabled?: boolean;
}

function toValidArray(value: string[]) {
  const arr = Array.isArray(value) ? value : [value];
  return arr.filter((e) => e != null && e !== undefined);
}

const MultipleDatePicker = ({
  setValue,
  value,
  size,
  onChange,
  className,
  allowClear,
  name,
  label,
  useLabel,
  handleAddDate,
  handleDeteteDate,
  rules,
  disabled,
}: Props) => {
  const format = 'DD/MM';
  const { t } = useTranslation();
  const arrValues = useMemo(() => toValidArray(value), [value]);
  const tagRender = ({ value, onClose }: any) => {
    return (
      <Tag closable={!disabled} onClose={onClose} className={styles.tag__item}>
        {moment(value).format(format)}
      </Tag>
    );
  };

  const handleChangeCalendar = (selected: Moment) => {
    const selectedDate = convertToDateUtc(selected);
    const convertDate = moment(selectedDate).format(TIME_DAY);
    const index = arrValues.findIndex(
      (e) => moment(e).format(TIME_DAY) === convertDate,
    );

    const temp = [...arrValues];

    if (index !== -1) {
      handleDeteteDate && handleDeteteDate(temp[index]);
      temp.splice(index, 1);
    } else {
      handleAddDate && handleAddDate(selectedDate);
      temp.push(selectedDate);
    }
    setValue(temp);
  };

  const onDeselect = (oldSelect: string) => {
    const newVal = arrValues.filter(
      (e) => moment(e).format(TIME_DAY) !== moment(oldSelect).format(TIME_DAY),
    );

    handleDeteteDate && handleDeteteDate(oldSelect);
    setValue(newVal);
  };
  const customRenderDate = (current: Moment) => {
    if (arrValues.some((e) => current.isSame(e))) {
      return <div className={styles.selectedDate}>{current.format('DD')}</div>;
    }

    return <div>{moment(current).format('DD')}</div>;
  };

  return (
    <Form.Item
      name={name}
      label={useLabel ? label : null}
      rules={rules}
      valuePropName="selected"
    >
      <Select
        mode="multiple"
        showArrow
        tagRender={tagRender}
        value={arrValues}
        className={`${styles.select} ${className}`}
        dropdownMatchSelectWidth={false}
        onDeselect={onDeselect}
        maxTagCount="responsive"
        size={size ? size : 'large'}
        allowClear={allowClear || false}
        placeholder={t('multipleDatePicker.selectDate')}
        suffixIcon={<CalendarOutlined />}
        disabled={disabled}
        dropdownRender={() => {
          return (
            <div className={styles.calendar}>
              <Calendar
                fullscreen={false}
                dateFullCellRender={customRenderDate}
                onSelect={handleChangeCalendar}
                onChange={onChange}
              />
            </div>
          );
        }}
      />
    </Form.Item>
  );
};

export default MultipleDatePicker;
