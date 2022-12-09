import { createSlice } from '@reduxjs/toolkit';
import { EmployeeModel } from 'models/employee';
import { MenuItemType } from 'models/menu';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {} as EmployeeModel | undefined,
    roles: [] as number[],
    menus: [] as MenuItemType[],
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
