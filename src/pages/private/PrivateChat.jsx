import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import Layout from "../../Components/Layout/Layout";
import LeftSidePanel from "../../Components/PrivateChat/LeftSidePanel/LeftSidePanel";
import UserList from "../../Components/PrivateChat/UserList/UserList";
import { useHistory } from "react-router-dom";

import "./PrivateChat.css";
import PrivateMessages from "../../Components/PrivateChat/Messages/PrivateMessages";
import { userSelector } from "../../features/userSlice";
import firebaseApp from "../../firebase";
import {
  privateChatActions,
  privateChatSelector
} from "../../features/privateChatSlice";
import moment from "moment";

function PrivateChat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentPrivateRoomID = useSelector(
    privateChatSelector.currentPrivateRoomID
  );
  const isLogin = useSelector(userSelector.isLogin);
  const currentUserID = useSelector(userSelector.currentUserID);
  const friends = useSelector(userSelector.friends);
  const friendsLoadDone = useSelector(userSelector.isFriendsLoadDone);

  const [currentItem, setCurrentItem] = useState("friendList");
  const [newPrivateRooms, setNewPrivateRooms] = useState([]);

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin]);

  // 안 읽은 메시지 카운트 리셋
  useEffect(() => {
    if (currentPrivateRoomID) {
      setCountEqual(currentPrivateRoomID);
    }
  }, [currentPrivateRoomID]);

  useEffect(() => {
    return () => {
      dispatch(privateChatActions.clearCurrentPrivateRoom());
    };
  }, []);

  useEffect(() => {
    // private rooms 다운 / 해당 정보들은 editPrivateRooms()에서 정리
    if (currentUserID) {
      const ubsubscribe = firebaseApp.listenToPrivateRooms(async snap => {
        const privateRooms = snap.docChanges().map(async change => {
          if (change.type === "added") {
            console.log("private room added", change.doc.data());
            return { id: change.doc.id, ...change.doc.data() };
          } else if (change.type === "removed") {
            console.log("private room removed");
          } else if (change.type === "modified") {
            console.log("private room modifired", change.doc.data());
            const privateRoomID = change.doc.id;
            const roomData = change.doc.data();
            roomData.id = privateRoomID;
            const privateRoom = await arrangePrivateRoom(
              roomData,
              currentUserID
            );

            if (
              privateRoomID === currentPrivateRoomID &&
              roomData.lastMessageCreatedBy !== currentUserID &&
              roomData.userMsgCount[currentUserID] !== roomData.messageCounts
            ) {
              // 내가 채팅방에 있고 메시지를 보내지 않은 경우
              return await firebaseApp.changePrivateRoomMsgCount(
                privateRoomID,
                privateRoom.friendID
              );
            }

            dispatch(privateChatActions.replacePrivateRoom(privateRoom));
          }
        });

        const newPrivateRooms = await Promise.all(privateRooms);

        if (newPrivateRooms[0] !== undefined) {
          setNewPrivateRooms(newPrivateRooms);
        }
      });

      return ubsubscribe;
    }
  }, [currentUserID, currentPrivateRoomID]);

  useEffect(() => {
    // listenToPrivateRooms에서 받은 privateRooms들을 정리한 후 redux's privateRooms으로 보냄
    if (newPrivateRooms.length > 0 && friendsLoadDone === true) {
      editPrivateRooms(newPrivateRooms, currentUserID);
    }
  }, [newPrivateRooms, friendsLoadDone, currentUserID]);

  async function editPrivateRooms(privateRooms, currentUserID) {
    // privateRooms의 내용물을 필요한 정보로 대체
    const PrivateRoomsPromise = privateRooms.map(async room => {
      const privateRoom = await arrangePrivateRoom(room, currentUserID);
      return privateRoom;
    });
    const newPrivateRooms = await Promise.all(PrivateRoomsPromise);

    dispatch(privateChatActions.setPrivateRooms(newPrivateRooms));
  }

  async function arrangePrivateRoom(room, currentUserID) {
    const friendID = room.participants.find(
      participantID => participantID !== currentUserID
    );

    const privateRoom = {
      id: room.id,
      friendID,
      lastMessageTimeStamp: moment(room.lastMessageTimestamp.toDate()).format(
        "ll"
      ),
      lastMessage: room.lastMessage,
      messageCounts: room.messageCounts,
      userMsgCount: room.userMsgCount
    };

    const friendSnap = await room.userRefs[friendID].get();
    const friend = friendSnap.data();
    privateRoom.friendNickname = friend.nickname;
    privateRoom.friendAvatarURL = friend.avatarURL;

    return privateRoom;
  }

  // 처음 방에 들어가면 안 읽은 메시지 카운트 리셋
  async function setCountEqual(currentPrivateRoomID) {
    await firebaseApp.setCountsEqual(currentPrivateRoomID);
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
          {currentPrivateRoomID ? <PrivateMessages /> : <UserList />}
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default PrivateChat;
