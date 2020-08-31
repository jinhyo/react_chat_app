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

function App() {
  const dispatch = useDispatch();
  const isLogin = useSelector(userSelector.isLogin);
  // const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.checkAuth(user => {
      if (user) {
        console.log("user", user);

        firebase.getUser(user.uid).then(currentUser => {
          dispatch(
            userActions.setCurrentUser({ id: user.uid, ...currentUser })
          );
        });
      }

      return unsubscribe;
    });

    return unsubscribe;
  }, []);

  if (!isLogin) return <Loader active inverted size="huge" />;

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
