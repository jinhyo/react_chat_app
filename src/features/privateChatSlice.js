import { createSlice, createSelector } from "@reduxjs/toolkit";
import { makePrivateRoomID } from "../firebase";
import { original } from "immer";

const privateChatSlice = createSlice({
  name: "privateChatSlice",
  initialState: {
    privateRooms: [],
    currentPrivateRoom: null
  },
  reducers: {
    setPrivateRooms: (state, { payload: privateRooms }) => {
      state.privateRooms.push(...privateRooms);
    },
    setCurrentPrivateRoom: (
      state,
      { payload: { friendID, currentUserID, friendNickname, friendAvatarURL } }
    ) => {
      const privateRoomID = makePrivateRoomID(currentUserID, friendID);

      const privateRoom = isAlreadyInPrivateRooms(
        state.privateRooms,
        privateRoomID
      );

      // 기존 state.privateRooms에 friendID에 해당하는 privateRoom이 있는지 확인하고 없으면
      // 새로운 privateRoom을 임시로 만든다.(처음 채팅을 시작할 경우)
      // 만약 채팅을 한 글자라도 보낸다면 db의 privateRooms collection에 새로운 document가 만들어지고
      // privateChatSlice의 privateRooms에도 추가되니 2번째 줄에서 임시로 만든 privateRoom을 대체해야 한다.
      if (!privateRoom) {
        const currentPrivateRoom = {
          id: privateRoomID,
          friendID,
          friendNickname,
          friendAvatarURL
        };

        state.currentPrivateRoom = currentPrivateRoom;
        state.privateRooms.unshift(currentPrivateRoom);
      } else {
        // 기존 state,privateRooms에 있으면 사용

        const index = state.privateRooms.findIndex(
          room => room.friendID === friendID
        );
        state.privateRooms.splice(index, 1);
        state.privateRooms.unshift(privateRoom);
        state.currentPrivateRoom = privateRoom;
      }
    },
    clearCurrentPrivateRoom: state => {
      state.currentPrivateRoom = null;
    }
  }
});

function isAlreadyInPrivateRooms(privateRooms, privateRoomID) {
  return privateRooms.find(privateRoom => privateRoom.id === privateRoomID);
}

const selectPrivateRooms = createSelector(
  state => state.privateRooms,

  privateRooms => privateRooms
);

const selectCurrentPrivateRoom = createSelector(
  state => state.currentPrivateRoom,

  currentPrivateRoom => currentPrivateRoom
);

export const PRIVATE = privateChatSlice.name;
export const privateChatActions = privateChatSlice.actions;
export const privateChatReducers = privateChatSlice.reducer;

export const privateChatSelector = {
  privateRooms: state => selectPrivateRooms(state[PRIVATE]),
  currentPrivateRoom: state => selectCurrentPrivateRoom(state[PRIVATE])
};
