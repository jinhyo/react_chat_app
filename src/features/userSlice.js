import { createSlice, createSelector } from "@reduxjs/toolkit";

const InitialUser = {
  id: "",
  nickname: "",
  selfIntro: "",
  email: "",
  privateEmail: false,
  avatarURL: "",
  location: "",
  roomsIJoined: [
    /* { id: "", name: "" } */
  ],
  roomsICreated: [
    /* { id: "", name: "" } */
  ],
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    currentUser: InitialUser,
    isLogin: false,
    totalUsers: [],
    friends: [],
    currentFriend: null,
    isFriendsLoadDone: false,
    isUserLoading: true,
  },
  reducers: {
    setCurrentUser: (state, { payload: currentUser }) => {
      state.currentUser = currentUser;
      state.isUserLoading = false;
      state.isLogin = true;
    },
    updateProfile: (state, { payload: updatedInfo }) => {
      state.currentUser = { ...state.currentUser, ...updatedInfo };
    },
    clearUser: (state) => {
      state.currentUser = InitialUser;
      state.isLogin = false;
      state.isUserLoading = false;
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
        (room) => room.id !== targetRoomID
      );
    },
    setCountRoomIJoined: (state, { payload: { roomID, roomInfo } }) => {
      let targetRoom = state.currentUser.roomsIJoined.find(
        (room) => room.id === roomID
      );
      targetRoom.count = roomInfo.count;
    },
    setTotalUsers: (state, { payload: users }) => {
      state.totalUsers.unshift(...users);
    },
    addFriends: (state, { payload: friends }) => {
      if (friends !== null) {
        state.friends.unshift(...friends);
      }
      state.isFriendsLoadDone = true;
    },
    removeFriends: (state, { payload: friendID }) => {
      state.friends = state.friends.filter((friend) => friend.id !== friendID);
    },
    setCurrentFriend: (state, { payload: friendID }) => {
      state.currentFriend = state.friends.find(
        (friend) => friend.id === friendID
      );
    },
    clearCurrentFriend: (state) => {
      state.currentFriend = null;
    },
    setLoginStatus: (state, { payload: { index, userID, isLogin } }) => {
      if (index !== null) {
        state.friends[index].isLogin = isLogin;
      } else {
        const friend = state.friends.find((friend) => friend.id === userID);
        friend.isLogin = isLogin;
      }
    },
  },
});

const selectCurrentUser = createSelector(
  (state) => state.currentUser,

  (currentUser) => currentUser
);

const selectCurrentUserID = createSelector(
  (state) => state.currentUser?.id,

  (currentUserID) => currentUserID
);

const selectIsLogin = createSelector(
  (state) => state.isLogin,

  (isLogin) => isLogin
);

const selectRoomsIJoined = createSelector(
  (state) => state.currentUser.roomsIJoined,

  (roomsIJoined) => roomsIJoined
);

const selectTotalUsers = createSelector(
  (state) => state.totalUsers,

  (totalUsers) => totalUsers
);

const selectFriends = createSelector(
  (state) => state.friends,

  (friends) => friends
);

const selectCurrentFriend = createSelector(
  (state) => state.currentFriend,

  (currentFriend) => currentFriend
);

const selectIsFriendsLoadDone = createSelector(
  (state) => state.isFriendsLoadDone,

  (isFriendsLoadDone) => isFriendsLoadDone
);

const selectIsUserLoading = createSelector(
  (state) => state.isUserLoading,

  (isUserLoading) => isUserLoading
);

export const USER = userSlice.name;
export const userActions = userSlice.actions;
export const userReducers = userSlice.reducer;

export const userSelector = {
  currentUser: (state) => selectCurrentUser(state[USER]),
  isLogin: (state) => selectIsLogin(state[USER]),
  roomsIJoined: (state) => selectRoomsIJoined(state[USER]),
  totalUsers: (state) => selectTotalUsers(state[USER]),
  friends: (state) => selectFriends(state[USER]),
  currentFriend: (state) => selectCurrentFriend(state[USER]),
  isFriendsLoadDone: (state) => selectIsFriendsLoadDone(state[USER]),
  currentUserID: (state) => selectCurrentUserID(state[USER]),
  isUserLoading: (state) => selectIsUserLoading(state[USER]),
};
