import { Tag } from 'antd';
import { STATUS_COLORS } from 'constants/enums/common';

interface IProps {
  statusColor: STATUS_COLORS;
  text: string;
  customColor?: string;
  className?: string;
}
const BasicTag = ({ customColor, text, statusColor, className }: IProps) => {
  return (
    <Tag
      style={{ borderRadius: '5px' }}
      color={customColor ? customColor : statusColor}
      className={className}
    >
      {text}
    </Tag>
  );
};

export default BasicTag;
