import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "semantic-ui-react";
import { userActions, userSelector } from "../../../features/userSlice";
import { privateChatActions } from "../../../features/privateChatSlice";

function FriendCard({ privateRoom }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  const [author, setAuthor] = useState("");
  const [avatarURL, setavatarURL] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState("");
  console.log("888privateRoom", privateRoom);

  useEffect(() => {
    if (privateRoom) {
      setAuthor(privateRoom.friendNickname);
      setavatarURL(privateRoom.friendAvatarURL);
      setLastMessage(privateRoom?.lastMessage);
      setLastMessageTimestamp(privateRoom?.lastMessageTimestamp);
    }
  }, [privateRoom]);

  const handleSetCurrentPrivateRoom = useCallback(() => {
    dispatch(
      privateChatActions.setCurrentPrivateRoom({
        friendID: privateRoom.friendID,
        currentUserID: currentUser.id
      })
    );
  }, [privateRoom]);

  return (
    <Comment
      style={{ cursor: "pointer" }}
      onClick={handleSetCurrentPrivateRoom}
    >
      <Comment.Avatar src={avatarURL} />
      <Comment.Content>
        <Comment.Author>{author}</Comment.Author>
        <Comment.Metadata>{lastMessageTimestamp}</Comment.Metadata>
        <Comment.Text>{lastMessage}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default FriendCard;
