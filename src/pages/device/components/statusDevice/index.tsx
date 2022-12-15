import BasicTag from 'components/BasicTag';
import { STATUS, STATUS_COLORS } from 'constants/enums/common';
import { StatusTag } from 'models/common';
interface IProps {
  data: string;
}
export default function DeviceStatus({ data }: IProps) {
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
    case STATUS.ASSIGNED: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.ASSIGNED,
      };
      break;
    }
    case STATUS.AVAILABLE: {
      statusTag = {
        statusColor: STATUS_COLORS.SUCCESS,
        text: STATUS.AVAILABLE,
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
    case STATUS.DELETED: {
      statusTag = {
        statusColor: STATUS_COLORS.DEFAULT,
        text: STATUS.DELETED,
      };
      break;
    }
  }
  return <BasicTag statusColor={statusTag.statusColor} text={statusTag.text} />;
}
