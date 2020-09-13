import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";
import firebaseApp, { makePrivateRoomID } from "../../../firebase";
import {
  messagesActions,
  messagesSelector
} from "../../../features/messageSlice";

import PrivateMessageComment from "./PrivateMessageComment";
import PrivateMessageHeader from "./PrivateMessageHeader";
import PrivateMessageForm from "./PrivateMessageForm";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { userSelector } from "../../../features/userSlice";
import { privateChatSelector } from "../../../features/privateChatSlice";
import moment from "moment";

function PrivateMessages() {
  const toBottomRef = useRef();
  const dispatch = useDispatch();
  const currentPrivateRoom = useSelector(
    privateChatSelector.currentPrivateRoom
  );
  const currentUser = useSelector(userSelector.currentUser);
  const privateMessages = useSelector(messagesSelector.privateMesaages);
  console.log("privateMessages", privateMessages);

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  useEffect(() => {
    if (privateMessages) {
      scrollToBottom();
    }
  }, [privateMessages]);

  useEffect(() => {
    dispatch(messagesActions.clearPrivateMessages());

    const avatarURLs = {
      [currentPrivateRoom.friendID]: currentPrivateRoom.friendAvatarURL,
      [currentUser.id]: currentUser.avatarURL
    };

    const unsubscribe = firebaseApp.listenToPrivateMessages(
      currentPrivateRoom.id,
      async snap => {
        const privateMessages = snap.docChanges().map(async change => {
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
          debugger;
        });
        const totalMessages = await Promise.all(privateMessages);

        dispatch(messagesActions.setPrivateMessages(totalMessages));
      }
    );
    return unsubscribe;
  }, [currentPrivateRoom]);

  const scrollToBottom = useCallback(() => {
    if (toBottomRef.current) {
      toBottomRef.current.scrollIntoView(/* { behavior: "smooth" } */);
    }
  }, [toBottomRef]);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <PrivateMessageHeader
          searchMode={searchMode}
          handleSearchMode={handleSearchMode}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />

        {/* 메시지 */}
        <Segment
          className={searchMode ? "privateMessages__search" : "privateMessages"}
        >
          {searchResults.length > 0 ? (
            <PrivateMessageComment privateMessages={searchResults} />
          ) : (
            <PrivateMessageComment privateMessages={privateMessages} />
          )}

          <div ref={toBottomRef}></div>
        </Segment>
      </Comment.Group>

      {/* 메시지 입력 */}
      <PrivateMessageForm scrollToBottom={scrollToBottom} />
    </Segment>
  );
}

export default PrivateMessages;
