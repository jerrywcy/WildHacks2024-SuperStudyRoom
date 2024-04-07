import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SearchFilters {
  date: Date;
  start: Date;
  end: Date;
  capacity?: number;
  time: number;
}

interface SerializableSearchFilters {
  date: number;
  start: number;
  end: number;
  capacity?: number;
  time: number;
}

interface State {
  search?: SerializableSearchFilters;
}

const searchSlice = createSlice({
  name: "user",
  initialState: {} as State,
  reducers: {
    setSearch(state, action: PayloadAction<SerializableSearchFilters>) {
      state.search = action.payload;
    },
    removeSearch(state) {
      state.search = undefined;
    },
  },
});

export const { setSearch, removeSearch } = searchSlice.actions;

export default searchSlice.reducer;
