import { Tabs } from 'antd';
import DeviceRequest from './DeviceRequest';
import LeaveBenefitRequest from './LeaveBenefitRequest';

export default function RequestTabs() {
  return (
    <Tabs
      defaultActiveKey="1"
      type="line"
      size="large"
      items={[
        {
          label: 'Leave Benefit Request',
          key: '1',
          children: <LeaveBenefitRequest />,
        },
        {
          label: 'Device Request',
          key: '2',
          children: <DeviceRequest />,
        },
      ]}
    />
  );
}
