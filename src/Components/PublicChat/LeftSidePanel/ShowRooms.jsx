import React, { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { publicChatActions } from "../../../features/publicChatSlice";
import { Icon, Label, Menu } from "semantic-ui-react";

function ShowRooms({ rooms, type, currentType }) {
  const dispatch = useDispatch();

  const [currentRoomID, setCurrentRoomID] = useState("");

  useEffect(() => {
    if (currentType !== type) {
      setCurrentRoomID("");
    }
  }, [currentType, type]);

  const handleChangeChannel = useCallback(
    (e, { name }) => {
      setCurrentRoomID(name);
      const currentRoom = rooms.find(room => room.id === name);
      dispatch(publicChatActions.setType(type));
      dispatch(publicChatActions.setCurrentRoom(currentRoom.id));
    },
    [rooms]
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
              <Label color="teal">1</Label>
            )}
          </Menu.Item>
        ))}
    </>
  );
}

export default ShowRooms;
