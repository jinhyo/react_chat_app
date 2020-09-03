import React, { useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, Segment } from "semantic-ui-react";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { userSelector } from "../../../features/userSlice";
import { Picker } from "emoji-mart";

function MessageForm({ scrollToBottom }) {
  const inputRef = useRef();

  const currentUser = useSelector(userSelector.currentUser);
  const currentRoom = useSelector(publicChatSelector.currentRoom);

  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);

  const handleEmojiToggle = useCallback(() => {
    setEmoji(prev => !prev);
  }, []);

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    const createdBy = {
      id: currentUser.id,
      nickname: currentUser.nickname
    };
    try {
      await firebaseApp.sendMessage(text, createdBy, currentRoom.id);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
    setText("");
  }, [text, currentRoom, currentUser]);

  const handleAddEmoji = useCallback(emoji => {
    setText(prev => prev + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Form style={{ marginBottom: 5 }} onSubmit={handleSendMessage}>
        {emoji && (
          <Picker
            set="apple"
            style={{ position: "absolute", bottom: "40px", right: "10px" }}
            onSelect={handleAddEmoji}
          />
        )}
        <Input
          fluid
          ref={inputRef}
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
        icon={emoji ? "cancel" : "smile outline"}
        color="orange"
        onClick={handleEmojiToggle}
      />
      <Button
        icon="cloud upload"
        color="olive"
        // content={emoji ? "Close" : null}
        // onClick={handleEmojiToggle}
      />
    </>
  );
}

export default MessageForm;
