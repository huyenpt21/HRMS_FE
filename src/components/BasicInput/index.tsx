import { Form, Input, InputNumber } from 'antd';
import { CSSProperties, ReactNode } from 'react';
import styles from './index.module.less';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { NamePath } from 'antd/lib/form/interface';

export interface IInputProps {
  label?: string | ReactNode;
  rules?: object[];
  name?: string | NamePath;
  colon?: boolean;
  placeholder?: string;
  value?: string | number;
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
  type?: 'number' | 'textarea' | 'password' | 'email';
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
  rows?: number;
}
const BasicInput = (props: IInputProps) => {
  const isRequired = props.rules
    ? props.rules.filter((r: any) => r.required === true).length > 0
    : false;
  let InputContent: JSX.Element;

  switch (props.type) {
    case 'number':
      InputContent = (
        <InputNumber
          type={props.type}
          placeholder={props.placeholder}
          prefix={props.prefix}
          className={`${styles.input} ${props.className}`}
          value={props.value}
          id={props.id}
          addonAfter={props.addonAfter}
          addonBefore={props.addonBefore}
          bordered={props.bordered}
          defaultValue={props.defaultValue}
          status={props.status}
          maxLength={props.maxLength}
          disabled={props.disabled}
          onPressEnter={props.onPressEnter}
          onChange={props.onChange}
          size="large"
          style={props.inputStyle}
          min={props.min}
          max={props.max}
        />
      );

      break;
    case 'password':
      InputContent = (
        <Input.Password
          placeholder={props.placeholder}
          className={`${styles.input} ${props.className}`}
          readOnly={props.readOnly}
          disabled={props.disabled}
          size="large"
          prefix={props.prefix}
          suffix={props.suffix}
          style={props.inputStyle}
          onChange={props.onChange}
        />
      );
      break;
    case 'textarea':
      InputContent = (
        <Input.TextArea
          placeholder={props.placeholder}
          className={`${styles.input} ${props.className}`}
          value={props.value}
          id={props.id}
          allowClear={props.allowClear}
          bordered={props.bordered}
          defaultValue={props.defaultValue}
          status={props.status}
          maxLength={props.maxLength}
          disabled={props.disabled}
          onPressEnter={props.onPressEnter}
          onChange={props.onChange}
          size="large"
          style={props.inputStyle}
          rows={props.rows}
        />
      );
      break;
    default:
      InputContent = (
        <Input
          type={props.type}
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
          onChange={props.onChange}
          size="large"
          style={props.inputStyle}
        />
      );
  }
  return (
    <Form.Item
      label={props.label ? props.label : ''}
      colon={props.colon || false}
      name={props.name}
      required={isRequired}
      rules={props.rules}
      className={props.classNameFormItem}
      initialValue={props.initialValueForm}
      tooltip={props.tooltip}
      noStyle={props.noStyle}
      dependencies={props.dependencies}
      validateFirst={props.validateFirst}
    >
      {InputContent}
    </Form.Item>
  );
};
export default BasicInput;
