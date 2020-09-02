import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Segment,
  Header,
  Comment,
  Icon,
  Button,
  Label
} from "semantic-ui-react";
import Participants from "../../Share/Participants";
import OwnerCard from "../../Share/OwnerCard";
import moment from "moment";
import { userSelector, userActions } from "../../../features/userSlice";
import firebaseApp from "../../../firebase";
import {
  publicChatSelector,
  publicChatActions
} from "../../../features/publicChatSlice";

function RoomInfo() {
  const dispatch = useDispatch();

  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const currentUser = useSelector(userSelector.currentUser);

  const displayDate = useCallback(() => {
    const date = JSON.parse(currentRoom.createdAt);
    return moment(date).format("YYYY-MM-DD");
  }, [currentRoom]);

  const amIJoined = useCallback(() => {
    return currentRoom.participants.find(
      participant => participant.id === currentUser.id
    );
  }, [currentRoom, currentUser]);

  const handleLeaveRoom = useCallback(async () => {
    const { id } = currentUser;
    const { id: roomID } = currentRoom;
    try {
      await firebaseApp.leaveRoom(
        currentUser.id,
        currentRoom.id,
        currentRoom.name
      );
      dispatch(userActions.deleteRoomsIJoined(currentRoom.id));
      dispatch(
        publicChatActions.deleteParticipant({ roomID, participantID: id })
      );
    } catch (error) {
      console.error(error);
    }
  }, [currentRoom, currentUser]);

  const handleJoinRoom = useCallback(() => {
    const { id, nickname, avatarURL } = currentUser;
    const { id: roomID, name: roomName } = currentRoom;
    try {
      firebaseApp.joinRoom(id, nickname, avatarURL, roomName, roomID);
      dispatch(userActions.addRoomsIJoined({ id: roomID, name: roomName }));
      dispatch(
        publicChatActions.addParticipant({
          roomID,
          participant: { id, nickname, avatarURL }
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, [currentUser, currentRoom]);

  return (
    <Segment style={{ backgroundColor: "#fffff0", height: "90vh" }}>
      {/* 세부정보 */}
      <Header style={{ marginTop: 10 }} as="h2" dividing textAlign="center">
        <Header.Content style={{ marginBottom: 10 }}>
          {currentRoom.name}
        </Header.Content>
        {amIJoined() ? (
          <Label
            size="large"
            color="red"
            as="a"
            attached="top right"
            style={{ marginTop: 3, borderRadius: 10 }}
            content="나가기"
            onClick={handleLeaveRoom}
          ></Label>
        ) : (
          <Label
            size="large"
            color="teal"
            as="a"
            attached="top right"
            style={{ marginTop: 3, borderRadius: 10 }}
            content="참가"
            onClick={handleJoinRoom}
          ></Label>
        )}

        <Header.Subheader>{displayDate()}</Header.Subheader>
      </Header>
      <Header as="h5">
        <Icon name="info circle" />
        세부사항
      </Header>
      <p>{currentRoom.details}</p>

      {/* 만든사람 */}
      <Header as="h5">
        <Icon name="user circle" />
        만든사람
      </Header>
      <OwnerCard currentRoom={currentRoom} />

      {/* 참가자 */}
      <Comment.Group>
        <Header as="h3" dividing textAlign="center" style={{ marginTop: 10 }}>
          참가자
          <Header.Subheader style={{ marginTop: 10 }}>
            <span>
              <Icon name="users" /> {currentRoom.participants.length}
            </span>
            <span style={{ marginLeft: 40 }}>
              <Icon name="pencil alternate" />
              1111111111111
            </span>
          </Header.Subheader>
        </Header>
        <Participants participants={currentRoom.participants} />
      </Comment.Group>
    </Segment>
  );
}

export default RoomInfo;
