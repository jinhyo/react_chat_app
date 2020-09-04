import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import MessageComment from "./MessageComment";
import {
  messagesActions,
  messagesSelector
} from "../../../features/messageSlice";

import "./Messages.css";
import MessageHeader from "./MessageHeader";

function Messages() {
  const toBottomRef = useRef();
  const dispatch = useDispatch();
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const messages = useSelector(messagesSelector.publicMessages);
  console.log("messages", messages);

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  console.log("searchResults", searchResults);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

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
      }
    );

    return unsubscribe;
  }, [currentRoom]);

  const scrollToBottom = useCallback(() => {
    if (toBottomRef.current) {
      toBottomRef.current.scrollIntoView(/* { behavior: "smooth" } */);
    }
  }, [toBottomRef]);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <MessageHeader
          searchMode={searchMode}
          handleSearchMode={handleSearchMode}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />

        {/* 메시지 출력 */}
        <Segment className={searchMode ? "messages__search" : "messages"}>
          {searchResults.length > 0 ? (
            <MessageComment messages={searchResults} />
          ) : (
            <MessageComment messages={messages} />
          )}

          <div ref={toBottomRef}></div>
        </Segment>
      </Comment.Group>

      {/* 메시지 입력 */}
      <MessageForm scrollToBottom={scrollToBottom} />
    </Segment>
  );
}

export default Messages;
