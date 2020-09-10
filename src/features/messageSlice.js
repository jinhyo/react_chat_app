import { createSlice, createSelector } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
  name: "messagesSlice",
  initialState: {
    publicMessages: [],
    privateMessages: []
  },
  reducers: {
    setMessages: (state, { payload: messages }) => {
      state.publicMessages.push(...messages);
    },
    clearMessages: state => {
      state.publicMessages = [];
    },
    setPrivateMessages: (state, { payload: messages }) => {
      state.privateMessages.push(...messages);
    },
    clearPrivateMessages: state => {
      state.privateMessages = [];
    }
  }
});

const selectPublicMessages = createSelector(
  state => state.publicMessages,

  publicMessages => publicMessages
);

const selectPrivateMessages = createSelector(
  state => state.privateMessages,

  privateMessages => privateMessages
);

export const MESSAGES = messagesSlice.name;
export const messagesActions = messagesSlice.actions;
export const messagesReducers = messagesSlice.reducer;

export const messagesSelector = {
  publicMessages: state => selectPublicMessages(state[MESSAGES]),
  privateMesaages: state => selectPrivateMessages(state[MESSAGES])
};
