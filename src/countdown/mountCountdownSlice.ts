import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

const mountCountdownSlice = createSlice({
  name: 'mountCountdown',
  initialState: {
    value: false,
  },
  reducers: {
    mount: (state) => {
      state.value = true;
    },
    unmount: (state) => {
      state.value = false;
    },
  },
});

export const { mount, unmount } = mountCountdownSlice.actions;
export const selectorMountCountdown = (state: RootState) =>
  state.mountCountdown.value;
export default mountCountdownSlice.reducer;
