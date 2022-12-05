import { createSlice } from '@reduxjs/toolkit';
import { NotifcationModel } from 'models/notification';

export const deliveredNotifsSlice = createSlice({
  name: 'notification',
  initialState: {
    notiList: [] as NotifcationModel[],
  },
  reducers: {
    addNoti: (state, action) => {
      state.notiList = [...state.notiList, ...action.payload.newNotiList];
    },
  },
});

export const { addNoti } = deliveredNotifsSlice.actions;
export default deliveredNotifsSlice.reducer;
