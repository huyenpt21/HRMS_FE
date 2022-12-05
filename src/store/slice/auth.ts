import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: {},
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = {};
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
