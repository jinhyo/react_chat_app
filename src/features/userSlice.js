import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: {
      id: "",
      nickname: "",
      selfIntro: "",
      email: "",
      avatarURL: ""
    }
  },
  reducers: {
    setUser: (state, { payload: { currentUser } }) => {
      state.currentUser = currentUser;
    },
    clearUser: state => {
      state.currentUser = {};
    }
  },
  setUserAvatar: (state, { payload: { avatarURL } }) => {
    state.currentUser.avatarURL = avatarURL;
  }
});

export const USER = userSlice.name;
export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;
