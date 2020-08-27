import { createSlice } from "@reduxjs/toolkit";

const publicChatSlice = createSlice({
  name: "publicChatSlice",
  initialState: {
    currentRoom: null,
    messages: []
  },
  reducers: {
    setCurrentChannel: (state, { payload: currentRoom }) => {
      state.currentRoom = currentRoom;
    },
    setUserPosts: (state, { payload: userPosts }) => {
      state.userPosts = userPosts;
    }
  }
});

export const PUBLIC = publicChatSlice.name;
export const publicChatActions = publicChatSlice.actions;
export const publicChatReducers = publicChatSlice.reducer;
