import { Form, Input } from 'antd';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { paginationConfig } from 'constants/common';
import useDebounce from 'hooks/useDebounce';
import {
  CSSProperties,
  ReactNode,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import styles from './InputSearchDebounce.module.less';
export interface IInputProps {
  label?: string | ReactNode;
  rules?: object[];
  name?: string;
  colon?: boolean;
  useLabel?: boolean;
  placeholder?: string;
  value?: string;
  id?: string;
  onChange?: (e: any) => void;
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;
  allowClear?: boolean;
  bordered?: boolean;
  defaultValue?: string;
  status?: 'error' | 'warning';
  maxLength?: number;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onPressEnter?: (e: any) => void;
  className?: string;
  classNameFormItem?: string;
  initialValueForm?: string;
  tooltip?: LabelTooltipType;
  readOnly?: boolean;
  noStyle?: boolean;
  inputStyle?: CSSProperties;
  dependencies?: string[];
  validateFirst?: boolean;
  min?: string;
  max?: string;
  setStateQuery: Dispatch<SetStateAction<any>>;
  keyParam: string;
}
export default function InputDebounce(props: IInputProps) {
  const searchDebounce = useDebounce();
  const submitSearch = (value: string) => {
    props.setStateQuery((prev: any) => ({
      ...prev,
      page: paginationConfig.current,
      [props.keyParam]: value || undefined,
    }));
  };
  const changeSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    searchDebounce(() => {
      submitSearch(e.target.value);
    });
  };
  return (
    <Form.Item>
      <Input
        placeholder={props.placeholder}
        prefix={props.prefix}
        className={`${styles.input} ${props.className}`}
        value={props.value}
        id={props.id}
        addonAfter={props.addonAfter}
        addonBefore={props.addonBefore}
        allowClear={props.allowClear}
        bordered={props.bordered}
        defaultValue={props.defaultValue}
        status={props.status}
        maxLength={props.maxLength}
        disabled={props.disabled}
        suffix={props.suffix}
        onPressEnter={props.onPressEnter}
        onChange={props.onChange ? props.onChange : changeSearchHandler}
        size="large"
        style={props.inputStyle}
      />
    </Form.Item>
  );
}
