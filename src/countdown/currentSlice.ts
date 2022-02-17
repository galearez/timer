import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

const currentSlice = createSlice({
  name: 'current',
  initialState: {
    value: 0,
  },
  reducers: {
    next: (state) => {
      state.value = state.value + 1;
    },
    previous: (state) => {
      state.value = state.value - 1;
    },
    restart: (state) => {
      state.value = 0;
    },
  },
});

export const { next, previous, restart } = currentSlice.actions;
export const selectCurrent = (state: RootState) => state.current.value;
export default currentSlice.reducer;
