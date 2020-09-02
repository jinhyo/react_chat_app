import React, { useState, useCallback, useEffect } from "react";
import { Menu, Header, Icon, Button, Label } from "semantic-ui-react";
import AddRoomModal from "./AddRoomModal";
import {
  publicChatActions,
  publicChatSelector
} from "../../../features/publicChatSlice";
import firebaseApp from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";

function TotalRooms() {
  const dispatch = useDispatch();
  const totalRooms = useSelector(publicChatSelector.totalRooms);

  const [modal, setModal] = useState(false);
  const [currentRoomID, setCurrentRoomID] = useState("");

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const handleChangeChannel = useCallback(
    (e, { name }) => {
      setCurrentRoomID(name);
      const currentRoom = totalRooms.find(room => room.id === name);
      dispatch(publicChatActions.setCurrentRoom(currentRoom));
    },
    [totalRooms]
  );

  const displayTotalRooms = useCallback(() => {
    if (totalRooms.length > 0) {
      return totalRooms.map(room => (
        <Menu.Item
          key={room.id}
          name={room.id}
          active={room.id == currentRoomID}
          onClick={handleChangeChannel}
        >
          <span>{room.name}</span>
          <Label color="brown" style={{ opacity: 0.8 }} size="mini">
            <Icon name="user outline" /> {room.participants.length}
          </Label>
        </Menu.Item>
      ));
    }
  }, [totalRooms, currentRoomID]);

  return (
    <Menu.Menu style={{ marginTop: 50 }}>
      <Header as="h3" textAlign="center">
        <Icon name="globe" size="small" />
        전체 목록
      </Header>
      <Header as="p" textAlign="center">
        <Button color="green" size="tiny" onClick={openModal}>
          채팅방 추가
        </Button>
      </Header>

      {displayTotalRooms()}

      {/*Modal */}
      <AddRoomModal modal={modal} closeModal={closeModal} />
    </Menu.Menu>
  );
}

export default TotalRooms;
