import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PublicChat/LeftSidePanel/LeftSidePanel";
import RightSide from "../../Components/PublicChat/RightSide/RightSide";
import "./PublicChat.css";
import RoomInfo from "../../Components/PublicChat/RoomInfo.jsx/RoomInfo";
import { useSelector } from "react-redux";
import {
  publicChatActions,
  publicChatSelector
} from "../../features/publicChatSlice";

function PublicChat(props) {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  console.log("currentRoom", currentRoom);

  return (
    <Layout>
      <Grid stackable columns="equal">
        <Grid.Column tablet={5} computer={4} style={{ heigth: 100 }}>
          <LeftSidePanel />
        </Grid.Column>
        <Grid.Column tablet={7} computer={8}>
          {/* <Messages /> */}
          {currentRoom && <RoomInfo currentRoom={currentRoom} />}
        </Grid.Column>
        <Grid.Column tablet={4} computer={4}>
          <RightSide />
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PublicChat;
