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

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "semantic-ui-react";
import firebaseApp from "./firebase";
import { publicChatActions } from "./features/publicChatSlice";

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector(userSelector.isLogin);
  const currentUser = useSelector(userSelector.currentUser);

  useEffect(() => {
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
    const unsubscribe = firebaseApp.subscribeToAllRooms(async snap => {
      const totalRooms = snap.docChanges().map(async change => {
        if (change.type === "added") {
          console.log("room added");

          const createdBySnap = await change.doc.data().createdBy.get();

          const createdBy = {
            id: createdBySnap.id,
            ...createdBySnap.data()
          };

          delete createdBy.roomsICreated;
          delete createdBy.roomsIJoined;

          const participants = await firebaseApp.getParticipants(change.doc.id);

          const createdAt = JSON.stringify(
            change.doc.data().createdAt.toDate()
          );

          return {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt,
            createdBy,
            participants
          };
        } else if (change.type === "removed") {
          console.log("room removed", change.doc.data());
          dispatch(publicChatActions.deleteRoomFromTotalRooms(change.doc.id));
        } else if (change.type === "modified") {
          console.log("room modified");
        }
      });
      const newTotalRooms = await Promise.all(totalRooms);
      console.log("newTotalRooms", newTotalRooms);

      dispatch(publicChatActions.setTotalRooms(newTotalRooms));
    });

    return unsubscribe;
  }, []);

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
