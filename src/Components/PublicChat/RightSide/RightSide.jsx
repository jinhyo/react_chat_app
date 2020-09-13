import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
  Comment
} from "semantic-ui-react";
import { publicChatSelector } from "../../../features/publicChatSlice";
import OwnerCard from "../../Share/OwnerCard";
import Participants from "../../Share/Participants";
import { messagesSelector } from "../../../features/messageSlice";

function RightSide() {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const messages = useSelector(messagesSelector.publicMessages);

  const [activeIndex, setActiveIndex] = useState(0);
  const [userMessagesCounts, setUserMessagesCounts] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const userMessagesCounts = countUsersMessages(messages);
      setUserMessagesCounts(userMessagesCounts);
    }
  }, [messages]);

  const handleActiveIndex = useCallback(
    (e, { index }) => {
      const newIndex = activeIndex === index ? -1 : index;
      setActiveIndex(newIndex);
    },
    [activeIndex]
  );

  const displayTopPostsersLists = useCallback(userMessagesCounts => {
    const topPosters = Object.entries(userMessagesCounts).sort(
      (a, b) => b[1].count - a[1].count
    );

    return topPosters
      .map(([name, info], index) => (
        <List.Item key={index}>
          <Image avatar src={info.avatarURL} />
          <List.Content>
            <List.Header as="a">{name}</List.Header>
            <List.Description>{info.count}개 작성</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 3);
  }, []);

  function countUsersMessages(messages) {
    const userMessageCounts = messages.reduce((ac, message) => {
      if (message.createdBy.nickname in ac) {
        ac[message.createdBy.nickname].count += 1;
      } else {
        ac[message.createdBy.nickname] = {
          avatarURL: message.avatarURL,
          count: 1,
          id: message.createdBy.id
        };
      }
      return ac;
    }, {});
    return userMessageCounts;
  }

  return (
    <Segment /* loading={!currentChannel} */>
      <Header
        as="h3"
        textAlign="center"
        attached="top"
        style={{ marginTop: 3, borderRadius: 10, backgroundColor: "#fffff0" }}
      >
        {currentRoom?.name}
      </Header>
      {/* 세부사항 */}
      <Accordion styled attached="true" style={{ backgroundColor: "#fffff0" }}>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          세부사항
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {currentRoom?.details}
        </Accordion.Content>

        {/* 만든사람 */}
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          만든사람
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <Header as="h4">
            <Comment.Group>
              <OwnerCard user={currentRoom.createdBy} rightSide={true} />
            </Comment.Group>
          </Header>
        </Accordion.Content>

        {/* 참가자 */}
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="users" />
          참가인원
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>{currentRoom?.participants.length}명</p>
          <Participants participants={currentRoom?.participants} />
        </Accordion.Content>

        {/* 글 개수 */}
        <Accordion.Title
          active={activeIndex === 3}
          index={3}
          onClick={handleActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          채팅 현황
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 3}>
          <p>전체 글: {messages.length}개</p>
          <h5>Top 3</h5>
          <List>{displayTopPostsersLists(userMessagesCounts)}</List>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
}

export default RightSide;
