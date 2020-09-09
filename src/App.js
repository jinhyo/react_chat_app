import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import OtherProfile from "./pages/profile/OtherProfile";
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
  const totalUsers = useSelector(userSelector.totalUsers);
  console.log("totalUsers", totalUsers);
  const [temp, setTemp] = useState([1]);
  console.log("temp", temp);

  useEffect(() => {
    // 로그인 유저 확인
    const unsubscribe = firebaseApp.checkAuth(user => {
      if (user) {
        firebaseApp.getUser(user.uid).then(currentUser => {
          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // 전체 유저 정보 다운 - <UserList />에서 사용
    if (currentUser.id) {
      firebaseApp.listenToUsers(async snap => {
        const totalUsers = snap.docChanges().map(async change => {
          if (change.type === "added") {
            console.log("~~size", snap.size);

            console.log("change", change.doc);

            setTemp(prev => [...prev, 1]);
            const user = await change.doc.data();
            delete user.createdAt;

            if (user.privateEmail) {
              user.email = "비공개";
            }

            return { id: change.doc.id, ...user };
          }
        });

        console.log("~~~totalUsers", totalUsers);
        const newTotalUsers = await Promise.all(totalUsers);
        if (newTotalUsers[0] !== undefined) {
          // change.type이 removed or modified일 경우 undefined가 들어옴
          dispatch(
            userActions.setTotalUsers(
              newTotalUsers.filter(user => user?.id !== currentUser.id)
            )
          );
        }
      });
    }
  }, [currentUser.id]);

  useEffect(() => {
    // 공개 채팅방 정보 다운 - <PublicChat />에서 사용
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

  useEffect(() => {
    if (currentUser.id) {
      async function addedCb(change) {
        const { userRef } = change.doc.data();
        const userSnapshot = await userRef.get();
        const friend = { id: userSnapshot.id, ...userSnapshot.data() };
        delete friend.roomsICreated;
        delete friend.roomsIJoined;
        delete friend.createdAt;

        return friend;
      }

      const unsubscribe = firebaseApp.listenToFriends(async snap => {
        const friends = snap.docChanges().map(async change => {
          if (change.type === "added") {
            const friend = await addedCb(change);
            return friend;
          } else if (change.type === "removed") {
            console.log("friend removed");
          } else if (change.type === "modified") {
            console.log("friend modified");
          }
        });
        const newFriends = await Promise.all(friends);
        console.log("newFriends", newFriends);

        if (newFriends[0] !== undefined) {
          dispatch(userActions.addFriends(newFriends));
        }
      });

      return unsubscribe;
    }
  }, [currentUser.id]);

  // if (!isLogin && currentUser.id) {
  //   return <Loader active inverted size="huge" />;
  // }

  return (
    <Switch>
      <Route exact path="/" component={Layout} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/profile/:userID" component={OtherProfile} />
      <Route path="/public" component={PublicChat} />
      <Route path="/private" component={PrivateChat} />
    </Switch>
  );
}

export default App;
