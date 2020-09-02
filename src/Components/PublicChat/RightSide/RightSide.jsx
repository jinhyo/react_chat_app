import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";
import { publicChatSelector } from "../../../features/publicChatSlice";
import OwnerCard from "../../Share/OwnerCard";
import Participants from "../../Share/Participants";
import { messagesSelector } from "../../../features/messageSlice";

function RightSide() {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const messages = useSelector(messagesSelector.publicMessages);

  const [activeIndex, setActiveIndex] = useState(0);

  const controlActiveIndex = useCallback(
    (e, { index }) => {
      const newIndex = activeIndex === index ? -1 : index;
      setActiveIndex(newIndex);
    },
    [activeIndex]
  );
  return (
    <Segment /* loading={!currentChannel} */>
      <Header
        as="h3"
        textAlign="center"
        attached="top"
        style={{ marginTop: 3, borderRadius: 10, backgroundColor: "#fffff0" }}
      >
        {currentRoom.name}
      </Header>
      {/* 세부사항 */}
      <Accordion styled attached="true" style={{ backgroundColor: "#fffff0" }}>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={controlActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          세부사항
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {currentRoom.details}
        </Accordion.Content>

        {/* 만든사람 */}
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={controlActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          {currentRoom.createdBy.nickname}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Header as="h4">
            <OwnerCard currentRoom={currentRoom} rightSide={true} />
          </Header>
        </Accordion.Content>

        {/* 참가자 */}
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={controlActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="users" />
          참가인원
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>{currentRoom.participants.length}명</p>
          <Participants participants={currentRoom.participants} />
        </Accordion.Content>

        {/* 글 개수 */}
        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={controlActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          채팅 현황
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <p>전체 글: {messages.length}</p>
          <h4>Top 3</h4>
          {/* <Participants /> */}
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}

export default RightSide;
