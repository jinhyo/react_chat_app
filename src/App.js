import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import PrivateChat from "./pages/private/PrivateChat";
import PublicChat from "./pages/public/PublicChat";
import { useDispatch } from "react-redux";
import { userActions, userSelector } from "./features/userSlice";
import { useSelector } from "react-redux";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";
import { Loader } from "semantic-ui-react";
import firebaseApp from "./firebase";
import {
  publicChatActions,
  publicChatSelector
} from "./features/publicChatSlice";
import moment from "moment";

import "moment/locale/ko";

import "emoji-mart/css/emoji-mart.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";

moment.locale("ko");

function App() {
  const dispatch = useDispatch();
  const totalRooms = useSelector(publicChatSelector.totalRooms);
  const currentUserID = useSelector(userSelector.currentUserID);
  const currentPublicRoomID = useSelector(publicChatSelector.currentRoomID);
  const isFriendsLoadDone = useSelector(userSelector.isFriendsLoadDone);
  const friends = useSelector(userSelector.friends);
  const type = useSelector(publicChatSelector.type);
  const isUserLoading = useSelector(userSelector.isUserLoading);

  useEffect(() => {
    // 로그인 유저 확인
    const unsubscribe = firebaseApp.checkAuth(user => {
      if (user) {
        firebaseApp.getUser(user.uid).then(currentUser => {
          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
        });
      } else {
        dispatch(userActions.clearUser());
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // 친구목록 다운
    if (currentUserID && totalRooms) {
      async function addedCb(change) {
        const { userRef } = change.doc.data();
        const userSnapshot = await userRef.get();
        const friend = {
          id: userSnapshot.id,
          ...userSnapshot.data(),
          isLogin: false
        };
        delete friend.roomsICreated;
        delete friend.roomsIJoined;
        delete friend.createdAt;

        return friend;
      }

      const unsubscribe = firebaseApp.listenToFriends(async snap => {
        const friends = snap.docChanges().map(async change => {
          if (change.type === "added") {
            // 처음 로딩 때는 모든 친구 목록이 added로 들어옴
            // 이후에 추가할 경우에도 added로 들어옴
            const friend = await addedCb(change);

            return friend;
          } else if (change.type === "removed") {
            console.log("friend removed");
            dispatch(userActions.removeFriends(change.doc.id));
          } else if (change.type === "modified") {
            console.log("friend modified");
          }
        });
        if (friends.length === 0) {
          // 친구가 없을 경우 listenToPrivateRooms를 호출하기 위한
          // isFriendsLoadDone을 true로 만들기 위해 사용
          dispatch(userActions.addFriends(null));
        }

        const newFriends = await Promise.all(friends);
        console.log("newFriends", newFriends);

        if (newFriends[0] !== undefined) {
          dispatch(userActions.addFriends(newFriends));
        }
      });

      return unsubscribe;
    }
  }, [currentUserID]);

  useEffect(() => {
    // 전체 유저 정보 다운 - <UserList />에서 사용
    if (currentUserID) {
      const unsubscribe = firebaseApp.listenToUsers(async snap => {
        const totalUsers = snap.docChanges().map(async change => {
          if (change.type === "added") {
            const user = await change.doc.data();
            delete user.createdAt;

            if (user.privateEmail) {
              user.email = "비공개";
            }

            return { id: change.doc.id, ...user };
          }
        });

        const newTotalUsers = await Promise.all(totalUsers);
        if (newTotalUsers[0] !== undefined) {
          // change.type이 removed or modified일 경우 undefined가 들어옴
          dispatch(
            userActions.setTotalUsers(
              newTotalUsers.filter(user => user?.id !== currentUserID)
            )
          );
        }
      });

      return unsubscribe;
    }
  }, [currentUserID]);

  useEffect(() => {
    // 공개 채팅방 정보 다운 - <PublicChat />에서 사용
    if (currentUserID) {
      const unsubscribe = firebaseApp.subscribeToAllRooms(async snap => {
        console.log("~~~~~~~~~subscribeToAllRooms");
        const totalRooms = snap.docChanges().map(async change => {
          console.log("!!!~~~~~~~~~subscribeToAllRooms");

          if (change.type === "added") {
            const data = change.doc.data();
            console.log("room added", data);
            const roomID = change.doc.id;
            const roomData = await arrangeRoomData(data, roomID);

            return roomData;
          } else if (change.type === "removed") {
            console.log("room removed", change.doc.data());
            dispatch(publicChatActions.deleteRoomFromTotalRooms(change.doc.id));
          } else if (change.type === "modified") {
            const data = change.doc.data();
            console.log("room modified", change.doc.data());
            const roomID = change.doc.id;
            const roomData = await arrangeRoomData(data, roomID);
            console.log("!@@@!!~~roomData", roomData);

            if (roomData.participantsIDs.includes(currentUserID)) {
              // 내가 참여하고 있는 방일 경우
              if (
                currentPublicRoomID === roomID &&
                roomData.lastMessageCreatedBy !== currentUserID &&
                roomData.userMsgCount[currentUserID] !==
                  roomData.messageCounts &&
                type === "chat"
              ) {
                // 내가 채팅방에 있고 메시지를 보내지 않은 경우
                return await firebaseApp.changePublicRoomMsgCount(roomData.id);
              }
            }

            dispatch(publicChatActions.replaceRoom(roomData));
          }
        });

        const newTotalRooms = await Promise.all(totalRooms);
        if (newTotalRooms[0] !== undefined) {
          // removed & modified의 경우 newTotalRooms[0]에 undefined가 들어있음
          dispatch(publicChatActions.setTotalRooms(newTotalRooms));
        }
      });

      return unsubscribe;
    }
  }, [/* roomsIJoined */ currentUserID, currentPublicRoomID, type]);

  useEffect(() => {
    // 로그인 상태 알림
    if (currentUserID) {
      const connecteRef = firebaseApp.setLoginStatus();

      return () => {
        connecteRef.off();
      };
    }
  }, [currentUserID]);

  useEffect(() => {
    // friends가 redux에 저장된 이후 loginStatus 확인

    if (isFriendsLoadDone) {
      function addedCb(snap) {
        const index = friends.findIndex(friend => friend.id === snap.key);
        if (index !== -1) {
          dispatch(userActions.setLoginStatus({ index, isLogin: true }));
        }
      }

      function removedCb(snap) {
        const index = friends.findIndex(friend => friend.id === snap.key);
        if (index !== -1) {
          dispatch(userActions.setLoginStatus({ index, isLogin: false }));
        }
      }

      const presenceRef = firebaseApp.listenToLoginStatus(addedCb, removedCb);

      return () => {
        presenceRef.off();
      };
    }
  }, [isFriendsLoadDone, friends]);

  async function arrangeRoomData(roomData, roomID) {
    const createdBySnap = await roomData.createdBy.get();

    const createdBy = {
      id: createdBySnap.id,
      ...createdBySnap.data()
    };
    if (createdBy.privateEmail) {
      createdBy.email = "비공개";
    }

    delete createdBy.roomsICreated;
    delete createdBy.roomsIJoined;
    delete createdBy.createdAt;

    const participants = await firebaseApp.getParticipants(roomID);

    const participantsIDs = participants.map(data => data.id);

    const createdAt = JSON.stringify(roomData.createdAt.toDate());

    return {
      id: roomID,
      ...roomData,
      createdAt,
      createdBy,
      participants,
      participantsIDs
    };
  }

  return isUserLoading ? (
    <Loading />
  ) : (
    <Switch>
      <Route exact path="/" component={Layout} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/profile/:userID" component={Profile} />
      <Route path="/public" component={PublicChat} />
      <Route path="/private" component={PrivateChat} />
    </Switch>
  );
}

export default App;
