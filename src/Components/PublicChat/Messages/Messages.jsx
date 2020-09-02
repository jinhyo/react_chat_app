import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Comment,
  Header,
  Segment,
  Icon,
  Input,
  Divider
} from "semantic-ui-react";
import "./Messages.css";
import MessageForm from "./MessageForm";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import MessageComment from "./MessageComment";

function Messages() {
  const toBottomRef = useRef();
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  console.log("currentRoom", currentRoom);

  const [searchMode, setSearchMode] = useState(false);
  const [messages, setMessages] = useState([]);

  console.log("messages", messages);

  useEffect(() => {
    setMessages([]);
    const participants = currentRoom.participants;
    console.log("participants", participants);
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
            return { ...change.doc.data(), avatarURL: avatarURLs[senderID] };
          }
        });
        const totalMessages = await Promise.all(messages);
        setMessages(prev => [...prev, ...totalMessages]);
        scrollToBottom();
      }
    );

    return unsubscribe;
  }, [currentRoom]);

  const scrollToBottom = useCallback(() => {
    if (toBottomRef.current) {
      toBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [toBottomRef]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
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
        {searchMode ? (
          <>
            <Input fluid size="mini" icon="search" name="searchTerm" />
            <Divider />
          </>
        ) : null}

        <Segment className={searchMode ? "messages__search" : "messages"}>
          <MessageComment messages={messages} />
          <div ref={toBottomRef}></div>
        </Segment>
      </Comment.Group>

      <MessageForm scrollToBottom={scrollToBottom} />
    </Segment>
  );
}

export default Messages;
