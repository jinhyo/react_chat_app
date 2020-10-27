import React, { useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button } from "semantic-ui-react";
import { Picker } from "emoji-mart";

import firebaseApp from "../../../firebase";
import { userSelector } from "../../../features/userSlice";
import PictureModal from "./PictureModal";
import { privateChatSelector } from "../../../features/privateChatSlice";

function PrivateMessageForm() {
  const inputRef = useRef();

  const currentUser = useSelector(userSelector.currentUser);
  const currentPrivateRoom = useSelector(
    privateChatSelector.currentPrivateRoom
  );

  const [modal, setModal] = useState(false);

  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState(false);

  const handleEmojiToggle = useCallback(() => {
    setEmoji(prev => !prev);
  }, []);

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!text) {
      return;
    }

    try {
      await firebaseApp.sendPrivateMessage(currentPrivateRoom.friendID, text);
    } catch (error) {
      console.error(error);
    }
    setText("");
  }, [text, currentPrivateRoom, currentUser]);

  const handleAddEmoji = useCallback(emoji => {
    setText(prev => prev + emoji.native);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
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
          label={<Button color="teal" content="전송" />}
        />
      </Form>
      <Button
        icon={emoji ? "cancel" : "smile outline"}
        color="orange"
        onClick={handleEmojiToggle}
      />
      <Button icon="picture" color="olive" onClick={openModal} />
      <PictureModal modal={modal} closeModal={closeModal} />
    </>
  );
}

export default PrivateMessageForm;
