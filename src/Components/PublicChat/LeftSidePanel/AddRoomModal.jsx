import React, { useState, useCallback, useEffect } from "react";
// import AvatarEditor from "react-avatar-editor";
import {
  Modal,
  Button,
  Grid,
  Form,
  Input,
  Segment,
  TextArea
} from "semantic-ui-react";

const INITIAL_STATE = {
  roomName: "",
  roomDescription: ""
};

function AddRoomModal({ modal, closeModal }) {
  const [createLoading, setCreateLoading] = useState(false);
  const [initialState, setInitialState] = useState(INITIAL_STATE);

  useEffect(() => {
    if (!modal) {
      setInitialState(INITIAL_STATE);
    }
  }, [modal]);

  const handleInputChange = useCallback(e => {
    e.persist();
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleCreateRoom = useCallback(() => {}, []);

  return (
    <Modal open={modal} onClose={closeModal} size="tiny">
      <Modal.Header style={{ backgroundColor: "#fffff0" }}>
        채팅방 추가
      </Modal.Header>
      <Modal.Content style={{ backgroundColor: "#fffff0" }}>
        <Form size="large">
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
          </Segment>
        </Form>
      </Modal.Content>
      <Modal.Actions style={{ backgroundColor: "#f1f2f6" }}>
        <Button inverted primary>
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
