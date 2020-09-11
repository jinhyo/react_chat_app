import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { messagesSelector } from "../../../features/messageSlice";
import {
  privateChatSelector,
  privateChatActions
} from "../../../features/privateChatSlice";
import { userSelector } from "../../../features/userSlice";
import { makePrivateRoomID } from "../../../firebase";
import FriendCard from "./FriendCard";
import { Comment, Segment } from "semantic-ui-react";

function ChatList(props) {
  const dispatch = useDispatch();
  const privateRooms = useSelector(privateChatSelector.privateRooms);
  const currentPrivateRoom = useSelector(
    privateChatSelector.currentPrivateRoom
  );
  const currentUser = useSelector(userSelector.currentUser);
  console.log("privateRooms", privateRooms);

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
