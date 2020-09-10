import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Comment } from "semantic-ui-react";
import { userActions } from "../../../features/userSlice";

function FriendCard({ friend }) {
  const dispatch = useDispatch();

  const [author, setAuthor] = useState("");
  const [avatarURL, setavatarURL] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState("");
  console.log("friend", friend);

  useEffect(() => {
    if (friend) {
      setAuthor(friend.friendNickname);
      setavatarURL(friend.friendAvatarURL);
      setLastMessage(friend?.lastMessage);
      setLastMessageTimestamp(friend?.lastMessageTimestamp);
    }
  }, [friend]);

  const handleSetCurrentFriend = useCallback(() => {
    dispatch(userActions.setCurrentFriend(friend.friendID));
    console.log("friend.id", friend.id);
  }, [friend]);

  return (
    <Comment style={{ cursor: "pointer" }} onClick={handleSetCurrentFriend}>
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
