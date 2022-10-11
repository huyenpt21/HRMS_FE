import { Tag } from 'antd';
import { STATUS_COLORS } from 'constants/enums/common';

interface IProps {
  statusColor: STATUS_COLORS;
  text: string;
  customColor?: string;
}
const BasicTag = ({ customColor, text, statusColor }: IProps) => {
  return (
    <Tag
      style={{ borderRadius: '5px' }}
      color={customColor ? customColor : statusColor}
    >
      {text}
    </Tag>
  );
};

export default BasicTag;
