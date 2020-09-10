import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";

function PrivateMessageComment({ privateMessages }) {
  const currentUser = useSelector(userSelector.currentUser);
  console.log("~~privateMessages", privateMessages);

  const isMyMessage = useCallback(
    message => currentUser.id === message.createdBy.id,

    [currentUser]
  );

  const displayTime = useCallback(message => {
    const data = JSON.parse(message.createdAt);
    return moment(data).fromNow();
  }, []);

  const isMessageOrImage = useCallback(
    message => message.type === "message",
    []
  );

  return (
    <>
      {privateMessages.map((message, index) => (
        <div
          key={index}
          className={isMyMessage(message) ? "message__self" : ""}
        >
          <Comment>
            <div className={isMyMessage(message) ? "comment__dot" : ""}> </div>
            <Comment.Avatar src={message.avatarURL} />
            <Comment.Content>
              <Comment.Author as="a">
                {message.createdBy.nickname}
              </Comment.Author>
              <Comment.Metadata>
                <div>{displayTime(message)}</div>
              </Comment.Metadata>
              <Comment.Text>
                {isMessageOrImage(message)
                  ? message.content // 메시지
                  : message.content.map(imageURL => (
                      // 이미지
                      <Image
                        style={{ marginTop: 5 }}
                        key={imageURL}
                        src={imageURL}
                      />
                    ))}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </div>
      ))}
    </>
  );
}

export default PrivateMessageComment;
