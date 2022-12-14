import { createSlice } from '@reduxjs/toolkit';
import { USER_INFO, USER_MENU, USER_ROLES } from 'constants/common';
import { EmployeeModel } from 'models/employee';
import { MenuItemType } from 'models/menu';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isLogout: false,
    user: JSON.parse(localStorage.getItem(USER_INFO) ?? '{}') as EmployeeModel,
    roles: JSON.parse(localStorage.getItem(USER_ROLES) ?? '[]') as number[],
    menus: JSON.parse(
      localStorage.getItem(USER_MENU) ?? '[]',
    ) as MenuItemType[],
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = action.payload.isLogin;
    },
    getUserRoles: (state, action) => {
      state.roles = action.payload.userRoles;
    },
    getUserInfo: (state, action) => {
      state.user = action.payload.newUserInfor;
    },
    getUserMenu: (state, action) => {
      state.menus = action.payload.userMenu;
    },
    logout: (state, action) => {
      state.isLogout = action.payload.isLogout;
    },
  },
});

export const { getUserRoles, getUserInfo, getUserMenu, login, logout } =
  authSlice.actions;
export default authSlice.reducer;
