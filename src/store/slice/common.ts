import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';

interface SitemapInterface {
  key: string;
  path: string;
  sitemapCode?: string;
  children?: any;
}

interface State {
  sitemaps: SitemapInterface[];
}

const initialState: State = {
  sitemaps: [],
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setSitemap: (state, action: PayloadAction<SitemapInterface[]>) => {
      if (isEqual(state.sitemaps, action.payload)) return;
      state.sitemaps = action.payload;
    },
  },
});
// Actions
export const { setSitemap } = commonSlice.actions;

// Reducers
const commonReducers = commonSlice.reducer;
export default commonReducers;
