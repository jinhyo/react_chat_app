import React, { useState, useCallback } from "react";
import { Segment, Accordion, Header, Icon, Image } from "semantic-ui-react";
import OwnerCard from "../OwnerCard";
import Participants from "../Participants";

function RightSide(props) {
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
        채널명
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
        <Accordion.Content active={activeIndex === 0}>설명</Accordion.Content>

        {/* 만든사람 */}
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={controlActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          만든사람
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Header as="h4">
            <OwnerCard />
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
          <Participants />
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
          <p>전체 글: 120개</p>
          <Participants />
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}

export default RightSide;
