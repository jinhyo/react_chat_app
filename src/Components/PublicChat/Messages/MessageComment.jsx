import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Comment } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";

function MessageComment({ messages }) {
  const currentUser = useSelector(userSelector.currentUser);
  console.log("~~messages", messages);

  const isMyMessage = useCallback(
    message => (currentUser.id === message.createdBy.id ? "message__self" : ""),

    [currentUser]
  );

  return (
    <>
      {messages.map((message, index) => (
        <div key={index} className={isMyMessage(message)}>
          <Comment>
            <Comment.Avatar src={message.avatarURL} />
            <Comment.Content>
              <Comment.Author as="a">
                {message.createdBy.nickname}
              </Comment.Author>
              <Comment.Metadata>
                <div>{moment(message.createdAt.toDate()).fromNow()}</div>
              </Comment.Metadata>
              <Comment.Text>{message.content}</Comment.Text>
            </Comment.Content>
          </Comment>
        </div>
      ))}
    </>
  );
}

export default MessageComment;
