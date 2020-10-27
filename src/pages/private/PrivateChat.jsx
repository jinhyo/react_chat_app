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
            const id = change.doc.id;
            const data = change.doc.data();
            const {
              lastMessage,
              userMsgCount,
              lastMessageCreatedBy,
              messageCounts
            } = data;
            const friendID = data.participants.find(
              participantId => participantId !== currentUserID
            );

            const lastMessageTimeStamp = moment(
              data.lastMessageTimestamp.toDate()
            ).format("ll");

            if (
              currentPrivateRoomID === id &&
              messageCounts !== userMsgCount[currentUserID]
            ) {
              // 둘 중 누군가 메세지를 보낼때 마다 개인 채팅방에 있는 유저에게서 실행됨
              // 혼자 있을경우는 한명에게만, 두 명이 방에 있을 경우에는 두 명 다 실행됨
              await firebaseApp.changePrivateRoomMsgCount(
                currentPrivateRoomID,
                friendID
              );

              dispatch(
                privateChatActions.updatePrivateRoomInfo({
                  id,
                  lastMessage,
                  lastMessageTimeStamp,
                  currentUserID
                })
              );
            } else if (
              currentPrivateRoomID !== id &&
              messageCounts !== userMsgCount[lastMessageCreatedBy]
            ) {
              // 내가 개인 채팅방에 없을 경우 전체 채팅카운트만 증가
              dispatch(
                privateChatActions.updatePrivateRoomInfo({
                  id,
                  lastMessage,
                  lastMessageTimeStamp,
                  currentUserID: null
                })
              );
            } else if (
              messageCounts === userMsgCount[friendID] &&
              messageCounts === userMsgCount[currentUserID]
            ) {
              // 채팅방에 다시 들어올 경우 내가 읽지 않은 메시지 카운트를 전체 메시지 카운트와 동일하게 변경
              // (안 읽은 메시지 카운트 0으로 바꿈)
              dispatch(
                privateChatActions.setUnreadMessageCountEqual({
                  privateRoomID: id,
                  currentUserID
                })
              );
            }
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
      editPrivateRooms(newPrivateRooms, friends, currentUserID);
    }
  }, [newPrivateRooms, friendsLoadDone, currentUserID]);

  async function editPrivateRooms(privateRooms, friends, currentUserID) {
    // privateRooms의 내용물을 필요한 정보로 대체
    const PrivateRoomsPromise = privateRooms.map(async room => {
      const friendID = room.participants.find(
        participantID => participantID !== currentUserID
      );

      const friend = friends.find(friend => friend.id === friendID);

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

      if (friend) {
        // redux의 friends목록에 이미 있는 경우: 거기서 해당 nickname과 avatarURL가져옴
        privateRoom.friendNickname = friend.nickname;
        privateRoom.friendAvatarURL = friend.avatarURL;
      } else {
        // redux의 friends목록에 없는 경우 userRefs를 통해 db에서 가져옴
        const friendSnap = await room.userRefs[friendID].get();
        const friend = friendSnap.data();
        privateRoom.friendNickname = friend.nickname;
        privateRoom.friendAvatarURL = friend.avatarURL;
      }
      return privateRoom;
    });

    const newPrivateRooms = await Promise.all(PrivateRoomsPromise);

    dispatch(privateChatActions.setPrivateRooms(newPrivateRooms));
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
