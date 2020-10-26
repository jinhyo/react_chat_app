import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Header, Icon, Label } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";
import ShowRooms from "./ShowRooms";
import { publicChatSelector } from "../../../features/publicChatSlice";

function JoinedRooms() {
  const roomsIJoined = useSelector(userSelector.roomsIJoined);
  const currentType = useSelector(publicChatSelector.type);
  const totalRooms = useSelector(publicChatSelector.totalRooms);

  const displayRooms = useCallback(() => {
    if (roomsIJoined.length > 0 && totalRooms.length > 0) {
      const roomDatas = roomsIJoined.reduce((ac, room) => {
        const joinedRoom = totalRooms.find(troom => troom.id === room.id);
        console.log("joinedRoom", joinedRoom);
        ac.push(joinedRoom);

        return ac;
      }, []);

      console.log("roomDatas", roomDatas);

      return (
        <ShowRooms
          rooms={roomsIJoined}
          roomDatas={roomDatas}
          type="chat"
          currentType={currentType}
        />
      );
    }
  }, [roomsIJoined, totalRooms]);

  return (
    <Menu.Menu>
      <Header as="h3" textAlign="center" style={{ marginTop: 30 }}>
        <Icon name="comments" size="small" />
        참가 목록
      </Header>
      {displayRooms()}
    </Menu.Menu>
  );
}

export default JoinedRooms;
