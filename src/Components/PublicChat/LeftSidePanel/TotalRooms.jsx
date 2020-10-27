import React, { useState, useCallback } from "react";
import { Menu, Header, Icon, Button } from "semantic-ui-react";
import AddRoomModal from "./AddRoomModal";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { useSelector } from "react-redux";
import ShowRooms from "./ShowRooms";

function TotalRooms() {
  const totalRooms = useSelector(publicChatSelector.totalRooms);
  const currentType = useSelector(publicChatSelector.type);

  const [modal, setModal] = useState(false);

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

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

      <ShowRooms rooms={totalRooms} type="info" currentType={currentType} />

      {/*Modal */}
      <AddRoomModal modal={modal} closeModal={closeModal} />
    </Menu.Menu>
  );
}

export default TotalRooms;
