import { createSlice } from '@reduxjs/toolkit';
import { EmployeeModel, EmployeeRoles } from 'models/employee';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: {} as EmployeeModel | undefined,
    roles: [] as EmployeeRoles[],
  },
  reducers: {
    login: (state, action) => {
      state.user = { ...state.user, ...action.payload.newUserInfor };
      state.roles = action.payload.userRoles;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
