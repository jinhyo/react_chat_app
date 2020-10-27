import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Loader } from "semantic-ui-react";

import MessageForm from "./MessageForm";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import MessageComment from "./MessageComment";
import {
  messagesActions,
  messagesSelector
} from "../../../features/messageSlice";
import MessageHeader from "./MessageHeader";
import { userSelector } from "../../../features/userSlice";
import Typing from "./Typing";
import "./Messages.css";

function Messages() {
  const toBottomRef = useRef();
  const dispatch = useDispatch();

  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const currentUser = useSelector(userSelector.currentUser);
  const messages = useSelector(messagesSelector.publicMessages);

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageLoading, setMessageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentRoom) {
      function addedCallback(snap) {
        if (snap.key !== currentUser.id) {
          setTypingUsers(prev => [
            ...prev,
            { id: snap.key, nickname: snap.val() }
          ]);
        }
      }

      function removedCallback(snap) {
        setTypingUsers(prev => prev.filter(user => user.id !== snap.key));
      }

      const { typingRef, connectedRef } = firebaseApp.listenToTypings(
        currentRoom.id,
        addedCallback,
        removedCallback
      );

      return () => {
        typingRef.off();
        connectedRef.off();
      };
    }
  }, [currentRoom, currentUser]);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    dispatch(messagesActions.clearMessages());
    setMessageLoading(true);

    const unsubscribe = firebaseApp.subscribeToRoomMessages(
      currentRoom.id,
      async snap => {
        const messages = snap.docChanges().map(async change => {
          if (change.type === "added") {
            const data = change.doc.data();
            const createdBySnap = await data.createdBy.get();

            const { nickname, avatarURL } = createdBySnap.data();
            const createdBy = { id: createdBySnap.id, nickname };
            const createdAt = JSON.stringify(data.createdAt.toDate());
            delete data.createdBy;
            return {
              ...change.doc.data(),
              createdAt,
              avatarURL,
              createdBy
            };
          }
        });
        const totalMessages = await Promise.all(messages);
        dispatch(messagesActions.setMessages(totalMessages));
        setMessageLoading(false);
      }
    );

    return unsubscribe;
  }, [currentRoom]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (toBottomRef.current) {
      toBottomRef.current.scrollIntoView(/* { behavior: "smooth" } */);
    }
  }, [toBottomRef]);

  const displayMessages = useCallback(() => {
    if (searchResults.length > 0 || searchMode) {
      return <MessageComment messages={searchResults} />;
    } else if (!searchTerm) {
      return (
        <MessageComment messages={messages} scrollToBottom={scrollToBottom} />
      );
    }
  }, [searchResults, messages]);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <MessageHeader
          searchMode={searchMode}
          handleSearchMode={handleSearchMode}
          setSearchResults={setSearchResults}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />

        {/* 메시지 출력 */}
        <Segment className={searchMode ? "messages__search" : "messages"}>
          {messageLoading && <Loader active />}
          {displayMessages()}

          {typingUsers && <Typing typingUsers={typingUsers} />}

          <div ref={toBottomRef}></div>
        </Segment>
      </Comment.Group>

      {/* 메시지 입력 */}
      <MessageForm />
    </Segment>
  );
}

export default Messages;
