import React from "react";
import { Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PrivateChat/LeftSidePanel/LeftSidePanel";
import UserList from "../../Components/PrivateChat/UserList/UserList";

import "./PrivateChat.css";

function PrivateChat(props) {
  return (
    <Layout>
      <Grid stackable columns="equal">
        <Grid.Column tablet={6} computer={5} style={{ heigth: 100 }}>
          <LeftSidePanel />
        </Grid.Column>
        <Grid.Column tablet={9} computer={9}>
          <UserList />
        </Grid.Column>
        <Grid.Column tablet={1} computer={2}></Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PrivateChat;
