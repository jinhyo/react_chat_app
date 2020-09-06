import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import PrivateChat from "./pages/private/PrivateChat";
import PublicChat from "./pages/public/PublicChat";
import { useDispatch } from "react-redux";
import firebase from "./firebase";
import { userActions, userSelector } from "./features/userSlice";
import { useSelector } from "react-redux";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";
import { Loader } from "semantic-ui-react";
import firebaseApp from "./firebase";
import {
  publicChatActions,
  publicChatSelector
} from "./features/publicChatSlice";

import "emoji-mart/css/emoji-mart.css";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector(userSelector.isLogin);
  const currentUser = useSelector(userSelector.currentUser);
  const reload = useSelector(publicChatSelector.reload);

  useEffect(() => {
    // 전체 유저 정보 다운
    if (currentUser.id) {
      firebaseApp.listenToUsers(snap => {
        const totalUsers = snap.docChanges().map(change => {
          if (change.type === "added") {
            const user = change.doc.data();
            delete user.createdAt;

            if (user.privateEmail) {
              user.email = "비공개";
            }

            return { id: change.doc.id, ...user };
          }
        });
        dispatch(
          userActions.setTotalUsers(
            totalUsers.filter(user => user.id !== currentUser.id)
          )
        );
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // 로그인 유저 확인
    const unsubscribe = firebaseApp.checkAuth(user => {
      if (user) {
        firebaseApp.getUser(user.uid).then(currentUser => {
          delete currentUser.createdAt;

          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // 공개 채팅방 정보 다운
    const unsubscribe = firebaseApp.subscribeToAllRooms(async snap => {
      const totalRooms = snap.docChanges().map(async change => {
        if (change.type === "added") {
          const createdBySnap = await change.doc.data().createdBy.get();

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

          const roomID = change.doc.id;
          const participants = await firebaseApp.getParticipants(roomID);

          const messageCounts = await firebaseApp.getMessageCountFromPublicRoom(
            roomID
          );
          const createdAt = JSON.stringify(
            change.doc.data().createdAt.toDate()
          );

          return {
            id: roomID,
            ...change.doc.data(),
            createdAt,
            createdBy,
            participants,
            messageCounts
          };
        } else if (change.type === "removed") {
          console.log("room removed", change.doc.data());
          dispatch(publicChatActions.deleteRoomFromTotalRooms(change.doc.id));
        } else if (change.type === "modified") {
          console.log("room modified", change.doc.data());
        }
      });

      const newTotalRooms = await Promise.all(totalRooms);
      if (newTotalRooms[0] !== undefined) {
        // removed & modified의 경우 newTotalRooms[0]에 undefined가 들어있음
        dispatch(publicChatActions.setTotalRooms(newTotalRooms));
      }
    });

    return unsubscribe;
  }, [reload]);

  // if (!isLogin && currentUser.id) {
  //   return <Loader active inverted size="huge" />;
  // }

  return (
    <Switch>
      <Route exact path="/" component={Layout} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route path="/profile" component={Profile} />
      <Route path="/public" component={PublicChat} />
      <Route path="/private" component={PrivateChat} />
    </Switch>
  );
}

export default App;
