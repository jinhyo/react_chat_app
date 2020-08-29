import React from "react";
import { Menu, Header, Icon, Label } from "semantic-ui-react";

function JoinedRooms(props) {
  return (
    <Menu.Menu>
      <Header as="h3" textAlign="center" style={{ marginTop: 30 }}>
        <Icon name="comments" size="small" />
        참가중
      </Header>
      <Menu.Item
        name="inbox"
        // active={activeItem === "inbox"}
        // onClick={this.handleItemClick}
      >
        <Label color="teal">1</Label>
        Inbox
      </Menu.Item>

      <Menu.Item
        name="spam"
        // active={activeItem === "spam"}
        // onClick={this.handleItemClick}
      >
        <Label>51</Label>
        Spam
      </Menu.Item>
    </Menu.Menu>
  );
}

export default JoinedRooms;
