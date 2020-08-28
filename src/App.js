import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import PrivateChat from "./pages/private/PrivateChat";
import PublicChat from "./pages/public/PublicChat";
import { useDispatch } from "react-redux";
import firebase from "./firebase";
import { userActions } from "./features/userSlice";
import { useHistory } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = firebase.checkAuth(user => {
      if (user) {
        firebase.getUser(user.uid).then(currentUser => {
          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
          history.push("/");
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Layout} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route path="/public" component={PublicChat} />
      <Route path="/private" component={PrivateChat} />
    </Switch>
  );
}

export default App;
