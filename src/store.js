import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { USER, userReducers } from "./features/userSlice";
import { PUBLIC, publicChatReducers } from "./features/publicChatSlice";

const rootReducer = combineReducers({
  [PUBLIC]: publicChatReducers,
  [USER]: userReducers
});

const store = configureStore({ reducer: rootReducer });

export default store;
