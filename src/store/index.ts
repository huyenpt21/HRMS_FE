import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import commonSlice from './slice/common';

export const store = configureStore({
  reducer: {
    common: commonSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
