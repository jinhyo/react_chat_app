import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment } from "semantic-ui-react";
import { userActions, userSelector } from "../../../features/userSlice";
import { privateChatActions } from "../../../features/privateChatSlice";
import moment from "moment";

function FriendCard({ privateRoom }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.currentUser);

  console.log("privateRoom", privateRoom);

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
      <Comment.Avatar src={privateRoom.friendAvatarURL} />
      <Comment.Content>
        <Comment.Author>{privateRoom.friendNickname}</Comment.Author>
        <Comment.Metadata>{privateRoom.lastMessageTimeStamp}</Comment.Metadata>
        <Comment.Text>{privateRoom.lastMessage}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default FriendCard;
