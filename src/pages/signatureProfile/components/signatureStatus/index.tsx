import BasicTag from 'components/BasicTag';
import { STATUS, STATUS_COLORS } from 'constants/enums/common';
import { StatusTag } from 'models/common';
interface IProps {
  data: string;
}
export default function SignatureStatus({ data }: IProps) {
  let statusTag: StatusTag = {
    statusColor: STATUS_COLORS.PROCESSING,
    text: '',
  };
  switch (data) {
    case STATUS.PENDING: {
      statusTag = {
        statusColor: STATUS_COLORS.WARING,
        text: STATUS.PENDING,
      };
      break;
    }
    case STATUS.REGISTERED: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.REGISTERED,
      };
      break;
    }
  }
  return <BasicTag statusColor={statusTag.statusColor} text={statusTag.text} />;
}
