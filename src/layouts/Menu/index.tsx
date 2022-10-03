import { Menu, MenuProps } from 'antd';
import SvgIcon from 'components/SvgIcon';

export default function MenuSidebar() {
  type MenuItem = Required<MenuProps>['items'][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
  const items: MenuItem[] = [
    getItem('Dashboard', 'dashboard', <SvgIcon icon="home" />),
    getItem('Employee', 'employee', <SvgIcon icon="user" color="#000" />, [
      getItem('Employee List', 'allEmployees'),
      getItem('Subordinate List', 'mySubordinate'),
    ]),
    getItem('Request', 'request', <SvgIcon icon="delivery" />, [
      getItem('My request History', 'myRequest'),
      getItem('Subordinate Request List', 'subordinateRequestList'),
      getItem('All Request List', 'allRequestList'),
    ]),
    getItem('Device', 'device', <SvgIcon icon="mouse" />, [
      getItem('My Device List', 'myDeviceList'),
      getItem('My Request History', 'myDeviceRequest'),
      getItem('Subodinate Device List', 'subordinateDeviceList'),
      getItem('Subodinate Request List', 'subordinateDeviceRequestList'),
      getItem('All Request List', 'allDeviceRequestList'),
    ]),
    getItem('Time Check', 'timecheck', <SvgIcon icon="deadline" />, [
      getItem('My Time Check', 'myTimeCheck'),
      getItem('All Time Check List', 'allTimeCheckList'),
    ]),
  ];
  const onOpenChange = (keys: string[]) => {
    if (keys.length >= 2) {
      keys.splice(0, 1);
    }

    // setOpenKeys(keys);
  };
  return (
    <Menu
      theme="light"
      defaultSelectedKeys={['1']}
      mode="inline"
      onOpenChange={onOpenChange}
      triggerSubMenuAction="click"
      items={items}
    />
  );
}
