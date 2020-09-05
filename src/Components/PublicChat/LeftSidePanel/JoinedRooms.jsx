import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Header, Icon, Label } from "semantic-ui-react";
import { userSelector, userActions } from "../../../features/userSlice";
import ShowRooms from "./ShowRooms";
import { publicChatSelector } from "../../../features/publicChatSlice";
import firebaseApp from "../../../firebase";

function JoinedRooms() {
  const dispatch = useDispatch();
  const roomsIJoined = useSelector(userSelector.roomsIJoined);
  const currentType = useSelector(publicChatSelector.type);
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const [notifications, setNotifications] = useState([]);
  console.log("notifications", notifications);

  useEffect(() => {
    if (roomsIJoined.length > 0) {
      roomsIJoined.forEach(room => {
        listenToMessageCounts(room.id);
      });
    }
  }, [roomsIJoined]);

  // const listenToMessageCounts = useCallback(
  //   roomID => {
  //     return firebaseApp.listenToMessageCounts(roomID, snap => {
  //       console.log("!!notifications", notifications);
  //       setCounts(roomID, snap.size);
  //     });
  //   },
  //   [notifications]
  // );

  function listenToMessageCounts(roomID) {
    firebaseApp.listenToMessageCounts(roomID, snap => {
      console.log("!!notifications", notifications);
      setCounts(roomID, snap.size, notifications);
    });
  }

  function setCounts(roomID, totalSize) {
    console.log("~~notifications", notifications);
    let index = notifications.findIndex(noti => {
      console.log("noti.id", noti.id);
      console.log("roomID", roomID);
      return noti.id === roomID;
    });
    console.log("index", index);

    let newNotifications = Array.from(notifications);
    if (index !== -1) {
      const totalLastChecked = newNotifications[index].totalLastChecked;
      if (roomID !== currentRoom.id && totalSize - totalLastChecked > 0) {
        newNotifications[index].count = totalSize - totalLastChecked;
      }
      newNotifications[index].knownTotal = totalSize;
      setNotifications(newNotifications);
    } else {
      setNotifications(prev => [
        ...prev,
        {
          id: roomID,
          count: 0,
          totalLastChecked: totalSize,
          knownTotal: totalSize
        }
      ]);
    }
  }

  // const setCounts = useCallback(
  //   (roomID, totalSize) => {
  //     console.log("~~notifications", notifications);
  //     let index = notifications.findIndex(noti => {
  //       console.log("noti.id", noti.id);
  //       console.log("roomID", roomID);
  //       return noti.id === roomID;
  //     });
  //     console.log("index", index);

  //     let newNotifications = Array.from(notifications);
  //     if (index !== -1) {
  //       const totalLastChecked = newNotifications[index].totalLastChecked;
  //       if (roomID !== currentRoom.id && totalSize - totalLastChecked > 0) {
  //         newNotifications[index].count = totalSize - totalLastChecked;
  //       }
  //       newNotifications[index].knownTotal = totalSize;
  //       setNotifications(newNotifications);
  //     } else {
  //       setNotifications(prev => [
  //         ...prev,
  //         {
  //           id: roomID,
  //           count: 0,
  //           totalLastChecked: totalSize,
  //           knownTotal: totalSize
  //         }
  //       ]);
  //     }
  //   },
  //   [notifications, currentRoom]
  // );

  return (
    <Menu.Menu>
      <Header as="h3" textAlign="center" style={{ marginTop: 30 }}>
        <Icon name="comments" size="small" />
        참가 목록
      </Header>
      {roomsIJoined.length > 0 && (
        <ShowRooms rooms={roomsIJoined} type="chat" currentType={currentType} />
      )}
    </Menu.Menu>
  );
}

export default JoinedRooms;
