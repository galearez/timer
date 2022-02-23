import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface Activity {
  id: string;
  label: string;
  time: number;
}

type IntialState = {
  value: Activity[];
};

const routineSlice = createSlice({
  name: 'routine',
  initialState: {
    value: [],
  } as IntialState,
  reducers: {
    addRound: (state, action: PayloadAction<Activity>) => {
      state.value = [...state.value, action.payload];
    },
    removeRound: (state, action: PayloadAction<string>) => {
      let match = state.value.filter((round) => round.id !== action.payload);
      state.value = match;
    },
  },
});

export const { addRound, removeRound } = routineSlice.actions;
export const selectRoutine = (state: RootState) => state.rotuine.value;
export default routineSlice.reducer;