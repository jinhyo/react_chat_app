import { createSlice, createSelector } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: {
      id: "",
      nickname: "",
      selfIntro: "",
      email: "",
      privateEmail: false,
      avatarURL: "",
      location: ""
    }
  },
  reducers: {
    setCurrentUser: (state, { payload: currentUser }) => {
      state.currentUser = currentUser;
    },
    clearUser: state => {
      state.currentUser = {};
    },
    setUserAvatar: (state, { payload: { avatarURL } }) => {
      state.currentUser.avatarURL = avatarURL;
    }
  }
});

const selectCurrentUser = createSelector(
  state => state.currentUser,

  currentUser => currentUser
);

export const USER = userSlice.name;
export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;

export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER])
};
