import { configureStore } from '@reduxjs/toolkit';
import routineSlice from '../countdown/routineSlice';

const store = configureStore({
  reducer: {
    rotuine: routineSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
