import { Form, Radio, Space } from 'antd';
import { DIRECTION } from 'constants/enums/common';
import { RadioButtonType } from 'models/common';

interface IProps {
  label?: string;
  name: string;
  initialValue: any;
  direction?: DIRECTION;
  listRadio: RadioButtonType[];
}
export default function BasicRadioGroup({
  label,
  name,
  initialValue,
  direction,
  listRadio,
}: IProps) {
  return (
    <Form.Item
      label={label ? label : ''}
      name={name}
      initialValue={initialValue}
    >
      <Radio.Group>
        <Space direction={direction ? direction : DIRECTION.HORIZONTAL}>
          {listRadio.map((item: RadioButtonType, index: number) => {
            return (
              <Radio key={index} value={item.value}>
                {item.label}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    </Form.Item>
  );
}
