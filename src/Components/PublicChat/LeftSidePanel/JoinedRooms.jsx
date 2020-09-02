import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Header, Icon, Label } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import ShowRooms from "./ShowRooms";

function JoinedRooms() {
  const roomsIJoined = useSelector(userSelector.roomsIJoined);

  console.log("roomsIJoined", roomsIJoined);

  return (
    <Menu.Menu>
      <Header as="h3" textAlign="center" style={{ marginTop: 30 }}>
        <Icon name="comments" size="small" />
        참가 목록
      </Header>
      {roomsIJoined.length > 0 && <ShowRooms rooms={roomsIJoined} />}
    </Menu.Menu>
  );
}

export default JoinedRooms;
