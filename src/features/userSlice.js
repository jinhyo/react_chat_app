import { createSlice, createSelector } from "@reduxjs/toolkit";

const InitialUser = {
  id: "",
  nickname: "",
  selfIntro: "",
  email: "",
  privateEmail: false,
  avatarURL: "",
  location: "",
  roomsIJoined: [{ id: "", name: "" }],
  roomsICreated: [{ id: "", name: "" }]
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
      console.log("state.currentUser", state.currentUser);
    },
    clearUser: state => {
      state.isLogin = false;
      state.currentUser = InitialUser;
    },
    setUserAvatar: (state, { payload: { avatarURL } }) => {
      state.currentUser.avatarURL = avatarURL;
    },
    addRoomsICreated: (state, { payload: newCreatedRoom }) => {
      state.currentUser.roomsICreated.push(newCreatedRoom);
    },
    addRoomsIJoined: (state, { payload: newRoom }) => {
      state.currentUser.roomsIJoined.push(newRoom);
    },
    deleteRoomsIJoined: (state, { payload: targetRoomID }) => {
      state.currentUser.roomsIJoined = state.currentUser.roomsIJoined.filter(
        room => room.id !== targetRoomID
      );
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

const selectRoomsIJoined = createSelector(
  state => state.currentUser.roomsIJoined,

  roomsIJoined => roomsIJoined
);

export const USER = userSlice.name;
export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;

export const userSelector = {
  currentUser: state => selectCurrentUser(state[USER]),
  isLogin: state => selectIsLogin(state[USER]),
  roomsIJoined: state => selectRoomsIJoined(state[USER])
};
