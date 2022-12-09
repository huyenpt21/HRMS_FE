import { createSlice } from '@reduxjs/toolkit';
import { USER_INFO, USER_MENU, USER_ROLES } from 'constants/common';
import { EmployeeModel } from 'models/employee';
import { MenuItemType } from 'models/menu';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem(USER_INFO) ?? '{}') as EmployeeModel,
    roles: JSON.parse(localStorage.getItem(USER_ROLES) ?? '[]') as number[],
    menus: JSON.parse(
      localStorage.getItem(USER_MENU) ?? '[]',
    ) as MenuItemType[],
  },
  reducers: {
    getUserRoles: (state, action) => {
      state.roles = action.payload.userRoles;
    },
    getUserInfo: (state, action) => {
      state.user = action.payload.newUserInfor;
    },
    getUserMenu: (state, action) => {
      state.menus = action.payload.userMenu;
    },
  },
});

export const { getUserRoles, getUserInfo, getUserMenu } = authSlice.actions;
export default authSlice.reducer;
