import { Checkbox, Form } from 'antd';
import { ReactNode } from 'react';

export interface ICheckboxProps {
  label?: string | ReactNode;
  rules?: object[];
  name?: string;
  useLabel?: boolean;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
  initialValueForm?: boolean;
  isRequired?: boolean;
  checked?: boolean;
  onChange?: any;
  isCheckBoxGroup?: boolean;
  options?: string[];
  checkedList?: string[];
}
const CheckboxGroup = Checkbox.Group;

const BasicCheckbox = (props: ICheckboxProps) => {
  return (
    <Form.Item
      valuePropName="checked"
      label={props.useLabel ? props.label : ''}
      name={props.name}
      required={props.isRequired}
      rules={props.rules}
      className={props.className}
      initialValue={props.initialValueForm}
    >
      {props.isCheckBoxGroup ? (
        <CheckboxGroup
          options={props.options}
          value={props.checkedList}
          onChange={props.onChange}
        />
      ) : (
        <Checkbox
          disabled={props.disabled}
          defaultChecked={props.checked}
          onChange={props.onChange}
        >
          {props.value}
        </Checkbox>
      )}
    </Form.Item>
  );
};

export default BasicCheckbox;
