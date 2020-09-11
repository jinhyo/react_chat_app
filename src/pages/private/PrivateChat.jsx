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
import {
  privateChatActions,
  privateChatSelector
} from "../../features/privateChatSlice";

function PrivateChat() {
  const dispatch = useDispatch();
  const currentPrivateRoom = useSelector(
    privateChatSelector.currentPrivateRoom
  );
  const currentUser = useSelector(userSelector.currentUser);
  const friends = useSelector(userSelector.friends);
  const friendsLoadDone = useSelector(userSelector.isFriendsLoadDone);

  const [currentItem, setCurrentItem] = useState("friendList");
  const [newPrivateRooms, setNewPrivateRooms] = useState([]);
  console.log("newPrivateRooms", newPrivateRooms);
  console.log("friendsLoadDone", friendsLoadDone);

  useEffect(() => {
    // private rooms 다운 / 해당 정보들은 assignPrivateRooms()에서 정리
    if (currentUser.id) {
      const ubsubscribe = firebaseApp.listenToPrivateRooms(snap => {
        const privateRooms = snap.docChanges().map(change => {
          if (change.type === "added") {
            console.log("private room added", change.doc.data());
            return { id: change.doc.id, ...change.doc.data() };
          } else if (change.type === "removed") {
            console.log("prive room removed");
          } else if (change.type === "modified") {
            console.log("prive room modifired", change.doc.data());
          }
        });

        if (privateRooms[0] !== undefined) {
          setNewPrivateRooms(privateRooms);
        }
      });

      return ubsubscribe;
    }
  }, [currentUser.id]);

  useEffect(() => {
    // listenToPrivateRooms에서 받은 privateRooms들을 정리한 후 redux's privateRooms으로 보냄
    if (newPrivateRooms.length > 0 && friendsLoadDone === true) {
      assignPrivateRooms(newPrivateRooms, friends);
    }
  }, [newPrivateRooms, friendsLoadDone]);

  async function assignPrivateRooms(privateRooms, friends) {
    // privateRooms의 내용물을 필요한 정보로 대체
    const PrivateRoomsPromise = privateRooms.map(async room => {
      const friendID = room.participants.find(
        participantID => participantID !== currentUser.id
      );

      const friend = friends.find(friend => friend.id === friendID);
      const privateRoom = {
        id: room.id,
        friendID,
        lastMessageTimeStamp: JSON.stringify(room.lastMessageTimestamp),
        lastMessage: room.lastMessage
      };

      if (friend) {
        // redux의 friends목록에 이미 있는 경우: 거기서 해당 nickname과 avatarURL가져옴
        privateRoom.friendNickname = friend.nickname;
        privateRoom.friendAvatarURL = friend.avatarURL;
      } else {
        // friends목록에 없는 경우 userRefs를 통해 db에서 가져옴
        console.log("friendID", friendID);
        console.log("room", room);
        console.log("room userRefs", room.userRefs);
        console.log("room userRefs friendID", room.userRefs.friendID);

        const friendSnap = await room.userRefs[friendID].get();
        const friend = friendSnap.data();
        privateRoom.friendNickname = friend.nickname;
        privateRoom.friendAvatarURL = friend.avatarURL;
      }
      return privateRoom;
    });

    const newPrivateRooms = await Promise.all(PrivateRoomsPromise);
    console.log("~~newPrivateRooms", newPrivateRooms);

    dispatch(privateChatActions.setPrivateRooms(newPrivateRooms));
  }

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
          {currentPrivateRoom ? <PrivateMessages /> : <UserList />}
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PrivateChat;
