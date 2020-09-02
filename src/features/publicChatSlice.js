import { createSlice, createSelector } from "@reduxjs/toolkit";

const INITIAL_CURRENT_ROOM = {
  id: "",
  name: "",
  details: "",
  createdAt: "",
  createdBy: { id: "", nickname: "" },
  participants: { userId: { nickname: "", avatarURL: "" } }
};

const publicChatSlice = createSlice({
  name: "publicChatSlice",
  initialState: {
    currentRoom: null,
    messages: [],
    totalRooms: [],
    currentRoomID: ""
  },
  reducers: {
    setCurrentRoom: (state, { payload: currentRoom }) => {
      state.currentRoom = currentRoom;
    },
    setTotalRooms: (state, { payload: totalRooms }) => {
      state.totalRooms.unshift(...totalRooms);
    },
    deleteRoomFromTotalRooms: (state, { payload: targetRoomID }) => {
      state.totalRooms = state.totalRooms.filter(
        room => room.id !== targetRoomID
      );
    }
  }
});

const selectCurrentRoom = createSelector(
  state => state.currentRoom,

  currentRoom => currentRoom
);

const selectCurrentRoomID = createSelector(
  state => state.currentRoomID,

  currentRoomID => currentRoomID
);

const selectTotalRooms = createSelector(
  state => state.totalRooms,

  totalRooms => totalRooms
);

export const PUBLIC = publicChatSlice.name;
export const publicChatActions = publicChatSlice.actions;
export const publicChatReducers = publicChatSlice.reducer;

export const publicChatSelector = {
  currentRoom: state => selectCurrentRoom(state[PUBLIC]),
  currentRoomID: state => selectCurrentRoomID(state[PUBLIC]),
  totalRooms: state => selectTotalRooms(state[PUBLIC])
};
