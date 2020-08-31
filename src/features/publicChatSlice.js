import { createSlice, createSelector } from "@reduxjs/toolkit";

const INITIAL_CURRENT_ROOM = {
  id: "",
  name: "",
  details: "",
  createdAt: "",
  createdBy: { id: "", nickname: "" },
  participants: { userId: "" }
};

const publicChatSlice = createSlice({
  name: "publicChatSlice",
  initialState: {
    currentRoom: null,
    messages: [],
    allRooms: []
  },
  reducers: {
    setCurrentChannel: (state, { payload: currentRoom }) => {
      state.currentRoom = currentRoom;
    },
    setRooms: (state, { payload: allRooms }) => {
      state.allRooms.unshift(...allRooms);
    }
  }
});

const selectCurrentRoom = createSelector(
  state => state.currentRoom,

  currentRoom => currentRoom
);

export const PUBLIC = publicChatSlice.name;
export const publicChatActions = publicChatSlice.actions;
export const publicChatReducers = publicChatSlice.reducer;

export const publicChatSelector = {
  currentRoom: state => state[PUBLIC]
};
