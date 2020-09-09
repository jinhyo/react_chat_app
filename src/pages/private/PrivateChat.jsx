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
        <Grid.Column tablet={7} computer={6} style={{ heigth: 100 }}>
          <LeftSidePanel />
        </Grid.Column>
        <Grid.Column tablet={9} computer={10}>
          <UserList />
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PrivateChat;
