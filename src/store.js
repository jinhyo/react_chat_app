import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { USER, userReducers } from "./features/userSlice";
import { PUBLIC, publicChatReducers } from "./features/publicChatSlice";
import { MESSAGES, messagesReducers } from "./features/messageSlice";
import { PRIVATE, privateChatReducers } from "./features/privateChatSlice";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const rootReducer = combineReducers({
  [PUBLIC]: publicChatReducers,
  [USER]: userReducers,
  [MESSAGES]: messagesReducers,
  [PRIVATE]: privateChatReducers
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production"
});

export default store;
