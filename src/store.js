import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { USER, userReducers } from "./features/userSlice";
import { PUBLIC, publicChatReducers } from "./features/publicChatSlice";
import { MESSAGES, messagesReducers } from "./features/messageSlice";
import { PRIVATE, privateChatReducers } from "./features/privateChatSlice";

const rootReducer = combineReducers({
  [PUBLIC]: publicChatReducers,
  [USER]: userReducers,
  [MESSAGES]: messagesReducers,
  [PRIVATE]: privateChatReducers
});

const store = configureStore({ reducer: rootReducer });

export default store;
