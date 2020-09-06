import React, { useEffect, useState } from "react";
import { Comment, Icon } from "semantic-ui-react";

function OwnerCard({ user, rightSide }) {
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [avatarURL, setavatarURL] = useState("");

  useEffect(() => {
    if (user) {
      setAuthor(user.nickname);
      setLocation(user.location);
      setEmail(user.email);
      setSelfIntro(user.selfIntro);
      setavatarURL(user.avatarURL);
    }
  }, [user]);

  return (
    <Comment>
      <Comment.Avatar src={avatarURL} />
      <Comment.Content>
        <Comment.Author>{author}</Comment.Author>
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
  );
}

export default OwnerCard;
