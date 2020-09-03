import { createSlice, createSelector } from "@reduxjs/toolkit";
import { original } from "immer";

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
    totalRooms: [],
    type: ""
  },
  reducers: {
    setCurrentRoom: (state, { payload: currentRoomID }) => {
      // state.currentRoom = original(
      //   state.totalRooms.find(room => room.id === currentRoomID)
      // );
      state.currentRoom = state.totalRooms.find(
        room => room.id === currentRoomID
      );
    },
    setTotalRooms: (state, { payload: totalRooms }) => {
      state.totalRooms.unshift(...totalRooms);
    },
    deleteRoomFromTotalRooms: (state, { payload: targetRoomID }) => {
      state.totalRooms = state.totalRooms.filter(
        room => room.id !== targetRoomID
      );
    },
    addParticipant: (state, { payload: { roomID, participant } }) => {
      const currentRoom = state.totalRooms.find(room => room.id === roomID);
      currentRoom.participants.push(participant);
      state.currentRoom.participants.push(participant);
    },
    deleteParticipant: (state, { payload: { roomID, participantID } }) => {
      const currentRoom = state.totalRooms.find(room => room.id === roomID);
      currentRoom.participants = currentRoom.participants.filter(
        participant => participant.id !== participantID
      );
      state.currentRoom.participants = state.currentRoom.participants.filter(
        participant => participant.id !== participantID
      );
    },
    setType: (state, { payload: type }) => {
      state.type = type;
    }
  }
});

const selectCurrentRoom = createSelector(
  state => state.currentRoom,

  currentRoom => currentRoom
);

const selectTotalRooms = createSelector(
  state => state.totalRooms,

  totalRooms => totalRooms
);

const selectType = createSelector(
  state => state.type,

  type => type
);

export const PUBLIC = publicChatSlice.name;
export const publicChatActions = publicChatSlice.actions;
export const publicChatReducers = publicChatSlice.reducer;

export const publicChatSelector = {
  currentRoom: state => selectCurrentRoom(state[PUBLIC]),
  totalRooms: state => selectTotalRooms(state[PUBLIC]),
  type: state => selectType(state[PUBLIC])
};
