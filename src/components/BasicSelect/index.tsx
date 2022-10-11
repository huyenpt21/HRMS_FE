import { Form, Select } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { MODE_TYPE, SIZE_TYPE } from 'constants/enums/common';
import { debounce } from 'lodash';
import { SelectBoxType } from 'models/common';
import { CSSProperties, Key } from 'react';
import styles from './index.module.less';

interface Props {
  name?: string;
  colon?: boolean;
  options: SelectBoxType[];
  disabled?: boolean;
  label?: string;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  placeholder?: string;
  loading?: boolean;
  mode?: MODE_TYPE;
  defaultValue?: string | boolean;
  onChange?: (value: any, options: any) => void;
  onSearch?: (value: string) => void;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: boolean;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  initialValueForm?: string | number;
  noStyle?: boolean;
  selectStyle?: CSSProperties;
  size?: SIZE_TYPE;
  namePath?: NamePath | undefined;
  key?: Key | null | undefined;
}

const BasicSelect = (props: Props) => {
  const isRequired = props.rules
    ? props.rules.filter((r: any) => r.required === true).length > 0
    : false;

  const handleSearchDebounce = debounce((value: string) => {
    return props.onSearch && props.onSearch(value);
  }, 500);

  return (
    <Form.Item
      label={props.label ? props.label : ''}
      colon={props.colon || false}
      name={props.name ?? props.namePath}
      required={isRequired}
      rules={props.rules}
      className={props.classNameFormItem}
      initialValue={props.initialValueForm}
      noStyle={props.noStyle}
      key={props.key}
    >
      <Select
        getPopupContainer={props.getPopupContainer}
        className={`${props.className} ${styles.item}`}
        disabled={props.disabled}
        placeholder={props.placeholder}
        loading={props.loading}
        mode={props.mode}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        allowClear={props.allowClear}
        showSearch={props.showSearch}
        filterOption={props.filterOption || true}
        size={props.size || 'large'}
        onSearch={props.showSearch ? handleSearchDebounce : undefined}
        style={props.selectStyle}
      >
        {props.options.map((o: SelectBoxType, i: number) => (
          <Select.Option value={o.value} key={i}>
            {o.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default BasicSelect;
