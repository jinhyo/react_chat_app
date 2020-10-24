import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Comment, Label } from "semantic-ui-react";
import { userActions, userSelector } from "../../../features/userSlice";
import { privateChatActions } from "../../../features/privateChatSlice";

import "./LeftSidePanel.css";

function FriendCard({ privateRoom }) {
  const dispatch = useDispatch();
  const currentUserID = useSelector(userSelector.currentUserID);

  const handleSetCurrentPrivateRoom = useCallback(() => {
    dispatch(
      privateChatActions.setCurrentPrivateRoom({
        friendID: privateRoom.friendID,
        currentUserID
      })
    );
  }, [privateRoom, currentUserID]);

  const displayUnreadMessage = useCallback(() => {
    if (privateRoom.userMsgCount) {
      const unreadMsgCount =
        privateRoom.messageCounts - privateRoom.userMsgCount[currentUserID];
      if (unreadMsgCount > 0) {
        return (
          <div className="friendCard__label">
            <Label floating color="teal" content={unreadMsgCount} />
          </div>
        );
      }
    }
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
        {displayUnreadMessage()}
        <Comment.Text className="friendCard__text">
          {privateRoom.lastMessage}
        </Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default FriendCard;
