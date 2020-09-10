import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";
import firebaseApp from "../../../firebase";
import {
  messagesActions,
  messagesSelector
} from "../../../features/messageSlice";

import PrivateMessageComment from "./PrivateMessageComment";
import PrivateMessageHeader from "./PrivateMessageHeader";
import PrivateMessageForm from "./PrivateMessageForm";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { userSelector } from "../../../features/userSlice";

function PrivateMessages() {
  const toBottomRef = useRef();
  const dispatch = useDispatch();
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const currentUser = useSelector(userSelector.currentUser);
  const privateMessages = useSelector(messagesSelector.privateMesaages);
  console.log("privatemessages", privateMessages);

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

  useEffect(
    () => {
      dispatch(messagesActions.clearPrivateMessages());

      // const participants = currentRoom.participants;
      // const avatarURLs = participants.reduce((ac, participant) => {
      //   ac[participant.id] = participant.avatarURL;
      //   return ac;
      // }, {});
      // const unsubscribe = firebaseApp.subscribeToRoomMessages(
      //   currentRoom.id,
      //   async snap => {
      //     const privateMessages = snap.docChanges().map(async change => {
      //       if (change.type === "added") {
      //         const senderID = change.doc.data().createdBy.id;
      //         const createdAt = JSON.stringify(
      //           change.doc.data().createdAt.toDate()
      //         );
      //         return {
      //           ...change.doc.data(),
      //           createdAt,
      //           avatarURL: avatarURLs[senderID]
      //         };
      //       }
      //     });
      //     const totalMessages = await Promise.all(privateMessages);
      //     dispatch(messagesActions.setMessages(totalMessages));
      //   }
      // );
      // return unsubscribe;
    },
    [
      /* currentRoom */
    ]
  );

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
        <Segment className={searchMode ? "messages__search" : "messages"}>
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
