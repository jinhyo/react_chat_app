import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Comment, Image, Label } from "semantic-ui-react";
import { userSelector } from "../../../features/userSlice";

function PrivateMessageComment({ privateMessages, scrollToBottom }) {
  const currentUser = useSelector(userSelector.currentUser);

  const [yearMonthDay, setYearMonthDay] = useState([]);

  useEffect(() => {
    // 년,월,일 계산
    privateMessages.reduce((ac, message) => {
      const date = JSON.parse(message.createdAt);
      const yearMonthDay = date.slice(0, 10);

      if (!ac.includes(yearMonthDay)) {
        ac.push(yearMonthDay);
        setYearMonthDay(prev => [...prev, date]);
      }
      return ac;
    }, []);

    return () => {
      setYearMonthDay([]);
    };
  }, [privateMessages]);

  const isMyMessage = useCallback(
    message => currentUser.id === message.createdBy.id,

    [currentUser]
  );

  const displayYearMonthDay = useCallback(
    createdAt => {
      const date = JSON.parse(createdAt);
      if (yearMonthDay.includes(date)) {
        return (
          <div className="chat__yearMonthDay">
            <Label color="teal">{moment(date).format("ll")}</Label>
          </div>
        );
      } else {
        return null;
      }
    },
    [yearMonthDay]
  );

  const displayTime = useCallback(message => {
    const date = JSON.parse(message.createdAt);

    // return moment(date).format("LT");
    return moment(date).format("LLL");
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
          {/* 년, 월, 일 표시 */}
          {displayYearMonthDay(message.createdAt)}

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
                        onLoad={scrollToBottom}
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
