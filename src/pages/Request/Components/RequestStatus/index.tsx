import BasicTag from 'components/BasicTag';
import { STATUS, STATUS_COLORS } from 'constants/enums/common';
import { StatusTag } from 'models/common';
interface IProps {
  data: string;
}
export default function RequestStatus({ data }: IProps) {
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
    case STATUS.APPROVED: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.APPROVED,
      };
      break;
    }
    case STATUS.REJECTED: {
      statusTag = {
        statusColor: STATUS_COLORS.ERROR,
        text: STATUS.REJECTED,
      };
      break;
    }
  }
  return <BasicTag statusColor={statusTag.statusColor} text={statusTag.text} />;
}
