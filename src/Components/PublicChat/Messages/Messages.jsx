import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Comment,
  Header,
  Segment,
  Icon,
  Input,
  Divider
} from "semantic-ui-react";
import MessageForm from "./MessageForm";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import MessageComment from "./MessageComment";
import {
  messagesActions,
  messagesSelector
} from "../../../features/messageSlice";
import { Picker } from "emoji-mart";

import "./Messages.css";

function Messages() {
  const toBottomRef = useRef();
  const dispatch = useDispatch();
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const messages = useSelector(messagesSelector.publicMessages);

  console.log("currentRoom", currentRoom);
  console.log("messages", messages);

  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    dispatch(messagesActions.clearMessages());

    const participants = currentRoom.participants;
    const avatarURLs = participants.reduce((ac, participant) => {
      ac[participant.id] = participant.avatarURL;
      return ac;
    }, {});

    const unsubscribe = firebaseApp.subscribeToRoomMessages(
      currentRoom.id,
      async snap => {
        const messages = snap.docChanges().map(async change => {
          if (change.type === "added") {
            const senderID = change.doc.data().createdBy.id;
            const createdAt = JSON.stringify(
              change.doc.data().createdAt.toDate()
            );
            return {
              ...change.doc.data(),
              createdAt,
              avatarURL: avatarURLs[senderID]
            };
          }
        });
        const totalMessages = await Promise.all(messages);
        dispatch(messagesActions.setMessages(totalMessages));
        scrollToBottom();
      }
    );

    return unsubscribe;
  }, [currentRoom]);

  const scrollToBottom = useCallback(() => {
    if (toBottomRef.current) {
      toBottomRef.current.scrollIntoView(/* { behavior: "smooth" } */);
    }
  }, [toBottomRef]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <Header as="h2" dividing textAlign="center">
          <span>방 이름</span>
          <span style={{ marginLeft: 100, cursor: "pointer" }}>
            <Icon
              name="search"
              size="small"
              color="blue"
              onClick={handleSearchMode}
            />
          </span>
        </Header>

        {/* 검색창 */}
        {searchMode ? (
          <>
            <Input fluid size="mini" icon="search" name="searchTerm" />
            <Divider />
          </>
        ) : null}

        {/* 메시지 출력 */}
        <Segment className={searchMode ? "messages__search" : "messages"}>
          <MessageComment messages={messages} />

          <div ref={toBottomRef}></div>
        </Segment>
      </Comment.Group>

      {/* 메시지 입력 */}
      <MessageForm scrollToBottom={scrollToBottom} />
    </Segment>
  );
}

export default Messages;
