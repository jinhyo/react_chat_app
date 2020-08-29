import { createSlice, createSelector } from "@reduxjs/toolkit";

const InitialUser = {
  id: "",
  nickname: "",
  selfIntro: "",
  email: "",
  privateEmail: false,
  avatarURL: "",
  location: ""
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: InitialUser,
    isLogin: false
  },
  reducers: {
    setCurrentUser: (state, { payload: currentUser }) => {
      state.isLogin = true;
      state.currentUser = currentUser;
    },
    clearUser: state => {
      state.isLogin = false;
      state.currentUser = InitialUser;
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

const selectIsLogin = createSelector(
  state => state.isLogin,

  isLogin => isLogin
);

export const USER = userSlice.name;
export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;

export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER]),
  isLogin: state => selectIsLogin(state[USER])
};
