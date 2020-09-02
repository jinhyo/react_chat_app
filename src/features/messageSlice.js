import { createSlice, createSelector } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messagesSlice",
  initialState: {
    publicMessages: []
  },
  reducers: {
    setMessages: (state, { payload: messages }) => {
      state.publicMessages.push(...messages);
    },
    clearMessages: state => {
      state.publicMessages = [];
    }
  }
});

const selectMessages = createSelector(
  state => state.publicMessages,

  publicMessages => publicMessages
);

export const MESSAGES = messagesSlice.name;
export const messagesActions = messagesSlice.actions;
export const messagesReducers = messagesSlice.reducer;

export const messagesSelector = {
  publicMessages: state => selectMessages(state[MESSAGES])
};
