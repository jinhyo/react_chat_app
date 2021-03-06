import { createSlice, createSelector } from "@reduxjs/toolkit";

const publicChatSlice = createSlice({
  name: "publicChatSlice",
  initialState: {
    currentRoom: null,
    totalRooms: [],
    type: "",
    reload: 0
  },
  reducers: {
    setCurrentRoom: (state, { payload: currentRoomID }) => {
      state.currentRoom = state.totalRooms.find(
        room => room.id === currentRoomID
      );
    },
    clearCurrentRoom: state => {
      state.currentRoom = null;
    },
    clearTotalRooms: state => {
      state.totalRooms = [];
    },
    setTotalRooms: (state, { payload: totalRooms }) => {
      const totalRoomsIDs = state.totalRooms.map(room => room.id);
      totalRooms.forEach(room => {
        if (!totalRoomsIDs.includes(room.id)) {
          state.totalRooms.unshift(room);
        }
      });
    },
    replaceRoom: (state, { payload: publicRoom }) => {
      const index = state.totalRooms.findIndex(
        room => room.id === publicRoom.id
      );
      state.totalRooms[index] = publicRoom;
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
    },
    callReload: state => {
      state.totalRooms = [];
      state.currentRoom = null;
      state.reload += 1; // 아바타 변경 후 <App />의 firebaseApp.subscribeToAllRooms()재 발동의 트리거
    },
    changePublicRoomMsgCounts: (
      state,
      { payload: { roomID, currentUserID } }
    ) => {
      const currentPublicRoom = state.totalRooms.find(
        room => room.id === roomID
      );
      currentPublicRoom.messageCounts++;

      if (currentUserID) {
        currentPublicRoom.userMsgCount[currentUserID]++;
      }
    },
    setUnreadMsgCountZero: (state, { payload: { roomID, currentUserID } }) => {
      const currentPublicRoom = state.totalRooms.find(
        room => room.id === roomID
      );
      currentPublicRoom.userMsgCount[currentUserID] =
        currentPublicRoom.messageCounts;
    },
    setJoinedRooms: (state, { payload: { roomID, currentUserID } }) => {
      const joinedRoom = state.totalRooms.find(room => room.id === roomID);
      joinedRoom.userMsgCount[currentUserID] = joinedRoom.messageCounts;
    }
  }
});

const selectCurrentRoom = createSelector(
  state => state.currentRoom,

  currentRoom => currentRoom
);

const selectCurrentRoomID = createSelector(
  state => state.currentRoom?.id,

  currentRoomID => currentRoomID
);

const selectTotalRooms = createSelector(
  state => state.totalRooms,

  totalRooms => totalRooms
);

const selectType = createSelector(
  state => state.type,

  type => type
);

const selectReload = createSelector(
  state => state.reload,

  reload => reload
);

export const PUBLIC = publicChatSlice.name;
export const publicChatActions = publicChatSlice.actions;
export const publicChatReducers = publicChatSlice.reducer;

export const publicChatSelector = {
  currentRoom: state => selectCurrentRoom(state[PUBLIC]),
  currentRoomID: state => selectCurrentRoomID(state[PUBLIC]),
  totalRooms: state => selectTotalRooms(state[PUBLIC]),
  type: state => selectType(state[PUBLIC]),
  reload: state => selectReload(state[PUBLIC])
};
