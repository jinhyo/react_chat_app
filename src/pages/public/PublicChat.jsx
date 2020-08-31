import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PublicChat/LeftSidePanel/LeftSidePanel";
import RightSide from "../../Components/PublicChat/RightSide/RightSide";
import "./PublicChat.css";
import RoomInfo from "../../Components/PublicChat/RoomInfo.jsx/RoomInfo";
import firebaseApp from "../../firebase";
import { publicChatActions } from "../../features/publicChatSlice";

function PublicChat(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = firebaseApp.subscribeToAllRooms(snap => {
      const rooms = snap.docs.map(doc => {
        const room = { id: doc.id, ...doc.data() };
        room.createdAt = JSON.stringify(room.createdAt);
        return room;
      });
      console.log(rooms);

      dispatch(publicChatActions.setRooms(rooms));
    });

    return unsubscribe;
  }, []);

  return (
    <Layout>
      <Grid stackable columns="equal">
        <Grid.Column tablet={5} computer={4} style={{ heigth: 100 }}>
          <LeftSidePanel />
        </Grid.Column>
        <Grid.Column tablet={7} computer={8}>
          {/* <Messages /> */}
          <RoomInfo />
        </Grid.Column>
        <Grid.Column tablet={4} computer={4}>
          <RightSide />
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PublicChat;
