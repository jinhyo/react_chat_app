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
import { userActions, userSelector } from "./features/userSlice";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userSelector.currentUser);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.checkAuth(user => {
      setUserLoading(true);
      console.log("user;", user);

      if (user) {
        firebase.getUser(user.uid).then(currentUser => {
          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
          setUserLoading(false);
          history.push("/");
        });
      }
    });

    return unsubscribe;
  }, []);

  // if (userLoading) return <Loader active inverted size="huge" />;
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
