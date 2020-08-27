import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { PUBLIC, publicChatReducers } from "./publicChatSlice";
import { USER, userReducers } from "./userSlice";

const rootReducer = combineReducers({
  [PUBLIC]: publicChatReducers,
  [USER]: userReducers
});

const store = configureStore({ reducer: rootReducer });

export default store;
