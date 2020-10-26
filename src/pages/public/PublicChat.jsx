import React, { useEffect, useCallback } from "react";
import { Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PublicChat/LeftSidePanel/LeftSidePanel";
import RightSide from "../../Components/PublicChat/RightSide/RightSide";
import "./PublicChat.css";
import RoomInfo from "../../Components/PublicChat/RoomInfo.jsx/RoomInfo";
import { useSelector, useDispatch } from "react-redux";
import {
  publicChatActions,
  publicChatSelector
} from "../../features/publicChatSlice";
import Messages from "../../Components/PublicChat/Messages/Messages";

function PublicChat(props) {
  const dispatch = useDispatch();
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const currentType = useSelector(publicChatSelector.type);

  console.log("currentRoom", currentRoom);

  useEffect(() => {
    return () => {
      dispatch(publicChatActions.setType(""));
      dispatch(publicChatActions.clearCurrentRoom());
    };
  }, []);

  const displayMain = useCallback(() => {
    if (currentRoom && currentType === "info") {
      return <RoomInfo />;
    } else if (currentRoom && currentType === "chat") {
      return <Messages />;
    }
  }, [currentRoom, currentType]);

  return (
    <Layout>
      <Grid stackable columns="equal">
        <Grid.Column tablet={5} computer={4} style={{ heigth: 100 }}>
          <LeftSidePanel />
        </Grid.Column>
        <Grid.Column tablet={7} computer={8}>
          {displayMain()}
        </Grid.Column>
        <Grid.Column tablet={4} computer={4}>
          {currentType === "chat" && <RightSide />}
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PublicChat;
