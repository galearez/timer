import { configureStore } from '@reduxjs/toolkit';
import routineSlice from '../countdown/routine-slice';
import currentSlice from '../countdown/current-slice';
import mountCountdownSlice from '../countdown/mount-countdown-slice';

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
