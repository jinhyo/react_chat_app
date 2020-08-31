import React, { useState, useCallback, useEffect } from "react";
import {
  Menu,
  Header,
  Icon,
  Button,
  Label,
  LabelDetail
} from "semantic-ui-react";
import AddRoomModal from "./AddRoomModal";
import {
  publicChatActions,
  publicChatSelector
} from "../../../features/publicChatSlice";
import firebaseApp from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";

function TotalRooms() {
  const dispatch = useDispatch();
  const currentRoomID = useSelector(publicChatSelector.currentRoomID);
  const totalRooms = useSelector(publicChatSelector.totalRooms);

  useEffect(() => {
    const unsubscribe = firebaseApp.subscribeToAllRooms(snap => {
      let totalRooms = [];
      snap.docChanges().forEach(change => {
        if (change.type === "added") {
          console.log("room added");
          const createdAt = JSON.stringify(change.doc.data().createdAt);
          totalRooms.push({
            id: change.doc.id,
            ...change.doc.data(),
            createdAt
          });
        } else if (change.type === "removed") {
          console.log("room removed");
        } else if (change.type === "modified") {
          console.log("room modified");
        }
      });
      dispatch(publicChatActions.setTotalRooms(totalRooms));
    });

    return unsubscribe;
  }, []);

  const [modal, setModal] = useState(false);
  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const handleChangeChannel = useCallback((e, { name }) => {
    dispatch(publicChatActions.setCurrentRoomID(name));
  }, []);

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
            <Icon name="user outline" /> {Object.keys(room.participants).length}
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
