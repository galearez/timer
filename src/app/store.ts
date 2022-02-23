import { configureStore } from '@reduxjs/toolkit';
import routineSlice from '../countdown/routineSlice';
import currentSlice from '../countdown/currentSlice';
import mountCountdownSlice from '../countdown/mountCountdownSlice';

const store = configureStore({
  reducer: {
    rotuine: routineSlice,
    current: currentSlice,
    mountCountdown: mountCountdownSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;