import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button } from "semantic-ui-react";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { userSelector } from "../../../features/userSlice";

function MessageForm(props) {
  const currentUser = useSelector(userSelector.currentUser);
  const currentRoom = useSelector(publicChatSelector.currentRoom);

  const [text, setText] = useState("");

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  const handleSendMessage = useCallback(() => {
    const createdBy = {
      id: currentUser.id,
      nickname: currentUser.nickname
    };
    try {
      firebaseApp.sendMessage(text, createdBy, currentRoom.id);
    } catch (error) {
      console.error(error);
    }
  }, [text, currentRoom, currentUser]);

  return (
    <div>
      <Form style={{ marginBottom: 5 }} onSubmit={handleSendMessage}>
        <Input
          fluid
          name="message"
          type="text"
          autoComplete="off"
          onChange={handleTextChange}
          value={text}
          labelPosition="right"
          // onKeyUp={handleTyping}
          // className={errorMessage.indexOf("message") ? "error" : ""}
          label={<Button color="teal" content="전송" />}
        />
      </Form>
      <Button
        icon="smile outline"
        color="orange"
        // content={emoji ? "Close" : null}
        // onClick={handleEmojiToggle}
      />
      <Button
        icon="cloud upload"
        color="olive"
        // content={emoji ? "Close" : null}
        // onClick={handleEmojiToggle}
      />
    </div>
  );
}

export default MessageForm;
