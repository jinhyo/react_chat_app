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
