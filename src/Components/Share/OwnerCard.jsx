import React, { useEffect, useState } from "react";
import { Comment, Icon } from "semantic-ui-react";

function OwnerCard({ currentRoom, rightSide }) {
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [avatarURL, setavatarURL] = useState("");

  useEffect(() => {
    if (currentRoom) {
      const { createdBy } = currentRoom;
      setAuthor(createdBy.nickname);
      setLocation(createdBy.location);
      setEmail(createdBy.email);
      setSelfIntro(createdBy.selfIntro);
      setavatarURL(createdBy.avatarURL);
    }
  }, [currentRoom]);

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src={avatarURL} />
        <Comment.Content>
          <Comment.Author as="a">{author}</Comment.Author>
          {!rightSide && (
            <Comment.Metadata>
              <Icon name="map marker alternate" style={{ marginRight: 5 }} />{" "}
              {location}
              <Icon name="mail" style={{ marginRight: 5, marginLeft: 10 }} />
              {email}
            </Comment.Metadata>
          )}

          <Comment.Text>{selfIntro}</Comment.Text>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
}

export default OwnerCard;
