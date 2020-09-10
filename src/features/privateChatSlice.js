import { createSlice, createSelector } from "@reduxjs/toolkit";

const privateChatSlice = createSlice({
  name: "privateChatSlice",
  initialState: {
    privateRooms: []
  },
  reducers: {
    setPrivateRooms: (state, { payload: privateRooms }) => {
      state.privateRooms.push(...privateRooms);
    }
  }
});

const selectPrivateRooms = createSelector(
  state => state.privateRooms,

  privateRooms => privateRooms
);

export const PRIVATE = privateChatSlice.name;
export const privateChatActions = privateChatSlice.actions;
export const privateChatReducers = privateChatSlice.reducer;

export const privateChatSelector = {
  privateRooms: state => selectPrivateRooms(state[PRIVATE])
};
