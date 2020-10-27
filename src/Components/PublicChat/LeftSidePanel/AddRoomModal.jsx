import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Form,
  Input,
  Segment,
  TextArea,
  Message
} from "semantic-ui-react";

import { userSelector, userActions } from "../../../features/userSlice";
import firebaseApp from "../../../firebase";

const INITIAL_STATE = {
  roomName: "",
  roomDescription: ""
};

function AddRoomModal({ modal, closeModal }) {
  const currentUser = useSelector(userSelector.currentUser);
  const dispatch = useDispatch();

  const [createLoading, setCreateLoading] = useState(false);
  const [initialState, setInitialState] = useState(INITIAL_STATE);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!modal) {
      setInitialState(INITIAL_STATE);
    }
  }, [modal]);

  const handleInputChange = useCallback(e => {
    e.persist();
    setError("");
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleCreateRoom = useCallback(async () => {
    const { roomName, roomDescription } = initialState;
    if (roomName.length === 0) {
      return setError("채팅방의 이름을 입력해 주세요.");
    } else if (roomDescription.length === 0) {
      return setError("채팅방의 세부사항을 입력해 주세요.");
    }
    try {
      setCreateLoading(true);
      const isDuplicateName = await firebaseApp.checkDuplicateName(roomName);
      if (isDuplicateName) {
        return alert("이미 같은 이름의 방이 있습니다.");
      }
      const newRoomID = await firebaseApp.createRoom(
        currentUser.id,
        currentUser.nickname,
        roomName,
        roomDescription,
        currentUser.avatarURL
      );
      dispatch(userActions.addRoomsICreated({ id: newRoomID, name: roomName }));
      dispatch(userActions.addRoomsIJoined({ id: newRoomID, name: roomName }));
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setCreateLoading(false);
      setError("");
    }
  }, [initialState]);

  return (
    <Modal open={modal} onClose={closeModal} size="tiny">
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        채팅방 추가
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <Form size="large" error={!!error}>
          <Segment stacked>
            <Form.Field>
              <Input
                fluid
                name="roomName"
                placeholder="채팅방 이름"
                type="text"
                value={initialState.roomName}
                onChange={handleInputChange}
              />
            </Form.Field>

            <Form.Field>
              <TextArea
                name="roomDescription"
                placeholder="세부사항"
                type="text"
                value={initialState.roomDescription}
                onChange={handleInputChange}
              />
            </Form.Field>
            <Message error content={error} />
          </Segment>
        </Form>
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button
          inverted
          primary
          loading={createLoading}
          onClick={handleCreateRoom}
        >
          추가
        </Button>
        <Button inverted onClick={closeModal} color="red">
          취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddRoomModal;
