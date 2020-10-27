import React from "react";
import { useSelector } from "react-redux";
import { Comment, Segment } from "semantic-ui-react";

import { privateChatSelector } from "../../../features/privateChatSlice";
import FriendCard from "./FriendCard";

function ChatList() {
  const privateRooms = useSelector(privateChatSelector.privateRooms);

  return (
    <Segment className="friends__list">
      <Comment.Group>
        {privateRooms.length > 0 &&
          privateRooms.map(privateRoom => (
            <FriendCard key={privateRoom.id} privateRoom={privateRoom} />
          ))}
      </Comment.Group>
    </Segment>
  );
}

export default ChatList;
