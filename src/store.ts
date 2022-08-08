import { configureStore } from '@reduxjs/toolkit';
import routineSlice from './app/routine-slice';
import currentSlice from './countdown/current-slice';
import mountCountdownSlice from './app/mount-countdown-slice';

const store = configureStore({
  reducer: {
    routine: routineSlice,
    current: currentSlice,
    mountCountdown: mountCountdownSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
