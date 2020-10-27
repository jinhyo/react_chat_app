import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Label, Menu } from "semantic-ui-react";

import { publicChatActions } from "../../../features/publicChatSlice";
import firebaseApp from "../../../firebase";
import { userSelector } from "../../../features/userSlice";

function ShowRooms({ rooms, type, currentType, roomDatas }) {
  const dispatch = useDispatch();

  const currentUserID = useSelector(userSelector.currentUserID);

  const [currentRoomID, setCurrentRoomID] = useState("");

  useEffect(() => {
    if (currentType !== type) {
      setCurrentRoomID("");
    }
  }, [currentType, type]);

  const handleChangeChannel = useCallback(
    async (e, { name }) => {
      setCurrentRoomID(name);
      const currentRoom = rooms.find(room => room.id === name);

      dispatch(publicChatActions.setType(type));
      dispatch(publicChatActions.setCurrentRoom(currentRoom.id));

      if (type === "chat") {
        try {
          await firebaseApp.setPublicMsgCountEqual(currentRoom.id);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [rooms]
  );

  const displayUnreadMsgCount = useCallback(
    room => {
      if (currentUserID && roomDatas) {
        const currentRoomData = roomDatas.find(
          roomData => roomData.id === room.id
        );

        if (!currentRoomData) {
          return null;
        }

        const unreadMsgCount =
          currentRoomData.messageCounts -
          currentRoomData.userMsgCount[currentUserID];

        if (unreadMsgCount > 0) {
          return <Label color="teal" content={unreadMsgCount} />;
        } else {
          return null;
        }
      }
    },
    [roomDatas, currentUserID]
  );

  return (
    <>
      {rooms.length > 0 &&
        rooms.map(room => (
          <Menu.Item
            key={room.id}
            name={room.id}
            active={room.id == currentRoomID}
            onClick={handleChangeChannel}
          >
            <span>{room.name}</span>
            {room.participants ? (
              <Label color="brown" style={{ opacity: 0.8 }} size="mini">
                <Icon name="user outline" /> {room.participants.length}
              </Label>
            ) : (
              <>{displayUnreadMsgCount(room)}</>
            )}
          </Menu.Item>
        ))}
    </>
  );
}

export default ShowRooms;
