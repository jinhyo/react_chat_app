import React, { useEffect, useState } from "react";
import { Comment, Icon, Label } from "semantic-ui-react";

function OwnerCard({ user, rightSide, friendList }) {
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [avatarURL, setavatarURL] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (user) {
      setAuthor(user.nickname);
      setLocation(user.location);
      setEmail(user.email);
      setSelfIntro(user.selfIntro);
      setavatarURL(user.avatarURL);
      setIsLogin(user.isLogin);
    }
  }, [user]);

  return (
    <div className="ownerCard">
      <Comment>
        <Comment.Avatar src={avatarURL} />
        <Comment.Content>
          <Comment.Author>{author}</Comment.Author>
          {!rightSide && (
            <Comment.Metadata>
              <Icon name="map marker alternate" style={{ marginRight: 5 }} />{" "}
              {location}
              <Icon name="mail" style={{ marginRight: 5, marginLeft: 10 }} />
              {user.privateEmail ? "비공개" : email}
              {friendList && (
                <Label
                  circular
                  attached="top right"
                  empty
                  color={isLogin ? "green" : "red"}
                />
              )}
            </Comment.Metadata>
          )}

          <Comment.Text>{selfIntro}</Comment.Text>
        </Comment.Content>
      </Comment>
    </div>
  );
}

export default OwnerCard;
