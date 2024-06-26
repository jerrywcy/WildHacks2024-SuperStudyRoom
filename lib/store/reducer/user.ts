import { Account } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  currentUser: Account | undefined;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: undefined,
  } as State,
  reducers: {
    setUser(state, action: PayloadAction<Account>) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    removeUser(state) {
      return {
        ...state,
        currentUser: undefined,
      };
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
