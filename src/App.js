import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import PrivateChat from "./pages/private/PrivateChat";
import PublicChat from "./pages/public/PublicChat";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Layout} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/public" component={PublicChat} />
        <Route path="/private" component={PrivateChat} />
      </Switch>
    </Router>
  );
}

export default App;
