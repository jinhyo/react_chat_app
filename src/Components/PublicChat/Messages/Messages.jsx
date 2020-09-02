import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Comment,
  Header,
  Form,
  Button,
  Segment,
  Icon,
  Input,
  Divider
} from "semantic-ui-react";
import "./Messages.css";
import MessageForm from "./MessageForm";
import firebaseApp from "../../../firebase";
import { publicChatSelector } from "../../../features/publicChatSlice";

function Messages(props) {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  console.log("~~currentRoom", currentRoom);

  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentRoom) {
      unsubscribe = firebaseApp.subscribeToRoomMessages(
        currentRoom.id,
        async snap => {
          console.log("~~snap.data()", snap.data());
        }
      );
    }

    return unsubscribe;
  }, [currentRoom]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        <Header as="h2" dividing textAlign="center">
          <span>방 이름</span>
          <span style={{ marginLeft: 100, cursor: "pointer" }}>
            <Icon
              name="search"
              size="small"
              color="blue"
              onClick={handleSearchMode}
            />
          </span>
        </Header>
        {searchMode ? (
          <>
            <Input fluid size="mini" icon="search" name="searchTerm" />
            <Divider />
          </>
        ) : null}

        <Segment className={searchMode ? "messages__search" : "messages"}>
          <Comment>
            <Comment.Avatar src="/images/avatar/small/matt.jpg" />
            <Comment.Content>
              <Comment.Author as="a">Matt</Comment.Author>
              <Comment.Metadata>
                <div>Today at 5:42PM</div>
              </Comment.Metadata>
              <Comment.Text>How artistic!</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>

          <Comment>
            <Comment.Avatar src="/images/avatar/small/elliot.jpg" />
            <Comment.Content>
              <Comment.Author as="a">Elliot Fu</Comment.Author>
              <Comment.Metadata>
                <div>Yesterday at 12:30AM</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>
                  This has been very useful for my research. Thanks as well!
                </p>
              </Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
            <Comment.Group>
              <Comment>
                <Comment.Avatar src="/images/avatar/small/jenny.jpg" />
                <Comment.Content>
                  <Comment.Author as="a">Jenny Hess</Comment.Author>
                  <Comment.Metadata>
                    <div>Just now</div>
                  </Comment.Metadata>
                  <Comment.Text>Elliot you are always so right :)</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            </Comment.Group>
          </Comment>

          <Comment>
            <Comment.Avatar src="/images/avatar/small/joe.jpg" />
            <Comment.Content>
              <Comment.Author as="a">Joe Henderson</Comment.Author>
              <Comment.Metadata>
                <div>5 days ago</div>
              </Comment.Metadata>
              <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        </Segment>
      </Comment.Group>

      <MessageForm />
    </Segment>
  );
}

export default Messages;
