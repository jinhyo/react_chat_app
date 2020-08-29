import React, { useState, useCallback } from "react";
import { Menu, Header, Icon, Label, Button } from "semantic-ui-react";
import AddRoomModal from "./AddRoomModal";

function TotalRooms(props) {
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

      <Menu.Item
        name="inbox"
        // active={activeItem === "inbox"}
        // onClick={this.handleItemClick}
      >
        Inbox
        <span style={{ marginLeft: 100 }}>
          <Icon name="user outline" />3
        </span>
      </Menu.Item>

      <Menu.Item
        name="spam"
        // active={activeItem === "spam"}
        // onClick={this.handleItemClick}
      >
        Spam
        <span style={{ marginLeft: 100 }}>
          <Icon name="user outline" />5
        </span>
      </Menu.Item>

      {/*Modal */}
      <AddRoomModal modal={modal} closeModal={closeModal} />
    </Menu.Menu>
  );
}

export default TotalRooms;
