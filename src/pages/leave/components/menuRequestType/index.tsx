import { Menu } from 'antd';
import { MENU_TYPE } from 'constants/enums/common';
import { LeaveBudgetListQuery } from 'models/leaveBudget';
import { MenuItem } from 'models/menu';
import moment from 'moment-timezone';
import { Dispatch, SetStateAction, memo } from 'react';

interface IProps {
  setStateQuery: Dispatch<SetStateAction<LeaveBudgetListQuery>>;
  menuType: MENU_TYPE;
}
const MenuRequestType = memo(({ setStateQuery, menuType }: IProps) => {
  const allAndSub = [
    { label: 'Annual Leave', key: 1 },
    // eslint-disable-next-line quotes
    { label: "Children's Sickness", key: 3 },
    { label: 'Unpaid Leave', key: 6 },
    { label: 'Sick Leave', key: 8 },
    { label: 'Bereavement Leave', key: 10 },
    { label: 'Over time', key: 7 },
  ];
  const mine = [
    { label: 'Leave Budget', key: 1 },
    { label: 'OT Budget', key: 7 },
  ];
  return (
    <Menu
      theme="light"
      mode="vertical"
      triggerSubMenuAction="click"
      defaultSelectedKeys={['1']}
      items={menuType === MENU_TYPE.MIME ? mine : allAndSub}
      onClick={(value: MenuItem) => {
        if (Number(value?.key) === 7) {
          setStateQuery((prev: any) => ({
            ...prev,
            requestTypeId: value?.key,
            month: moment().get('month') + 1,
          }));
        } else {
          setStateQuery((prev: any) => ({
            ...prev,
            requestTypeId: value?.key,
            month: undefined,
          }));
        }
      }}
    />
  );
});
export default MenuRequestType;
