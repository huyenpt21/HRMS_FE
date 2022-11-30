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
    case STATUS.ASSIGNED: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.ASSIGNED,
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
    case STATUS.CANCELLED: {
      statusTag = {
        statusColor: STATUS_COLORS.DEFAULT,
        text: STATUS.CANCELLED,
      };
      break;
    }
    case STATUS.RETURNED: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.RETURNED,
      };
      break;
    }
    case STATUS.USING: {
      statusTag = {
        statusColor: STATUS_COLORS.WARING,
        text: STATUS.USING,
      };
      break;
    }
  }
  return <BasicTag statusColor={statusTag.statusColor} text={statusTag.text} />;
}
