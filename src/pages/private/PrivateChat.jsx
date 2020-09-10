import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PrivateChat/LeftSidePanel/LeftSidePanel";
import UserList from "../../Components/PrivateChat/UserList/UserList";

import "./PrivateChat.css";
import PrivateMessages from "../../Components/PrivateChat/Messages/PrivateMessages";
import { userActions, userSelector } from "../../features/userSlice";
import firebaseApp from "../../firebase";
import { messagesActions } from "../../features/messageSlice";

function PrivateChat() {
  const dispatch = useDispatch();
  const currentFriend = useSelector(userSelector.currentFriend);
  const currentUser = useSelector(userSelector.currentUser);

  const [currentItem, setCurrentItem] = useState("friendList");
  console.log("currentFriend", currentFriend);

  useEffect(() => {
    // private rooms 다운
    if (currentUser.id) {
      const ubsubscribe = firebaseApp.listenToPrivateRooms(async snap => {
        const privateRooms = snap.docChanges().map(change => {
          if (change.type === "added") {
            const privateRoom = change.doc.data();
            console.log("~~privateRoom", privateRoom);
          } else if (change.type === "removed") {
            console.log("prive room removed");
          } else if (change.type === "modifired") {
            console.log("prive room removed");
          }
        });
        const newPrivateRooms = await Promise.all(privateRooms);
        console.log("newPrivateRooms", newPrivateRooms);

        if (newPrivateRooms[0] !== undefined) {
          dispatch(messagesActions.setPrivateMessages());
        }
      });

      return ubsubscribe;
    }
  }, [currentUser.id]);

  const handleItemClick = useCallback((e, { name }) => {
    setCurrentItem(name);
  }, []);

  return (
    <Layout>
      <Grid stackable columns="equal">
        <Grid.Column tablet={7} computer={6} style={{ heigth: 100 }}>
          <LeftSidePanel
            currentItem={currentItem}
            handleItemClick={handleItemClick}
          />
        </Grid.Column>
        <Grid.Column tablet={9} computer={10}>
          {currentFriend ? <PrivateMessages /> : <UserList />}
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PrivateChat;
