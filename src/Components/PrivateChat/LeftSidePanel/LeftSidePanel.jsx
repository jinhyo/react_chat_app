import React, { useState, useCallback } from "react";
import { Menu, Segment } from "semantic-ui-react";
import FriendList from "./FriendList";
import ChatList from "./ChatList";

function LeftSidePanel() {
  const [activeItem, setActiveItem] = useState("friendList");

  const handleItemClick = useCallback((e, { name }) => {
    setActiveItem(name);
  }, []);

  return (
    <Segment style={{ backgroundColor: "#6DD5FA", height: "90vh" }}>
      <Menu tabular>
        <Menu.Item
          name="friendList"
          active={activeItem === "friendList"}
          onClick={handleItemClick}
          children="친구"
        />
        <Menu.Item
          name="chatList"
          active={activeItem === "chatList"}
          onClick={handleItemClick}
          children="채팅"
        />
      </Menu>
      {activeItem === "friendList" ? <FriendList /> : <ChatList />}
    </Segment>
  );
}

export default LeftSidePanel;
