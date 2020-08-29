import React from "react";
import { Comment, Icon } from "semantic-ui-react";

function OwnerCard(props) {
  return (
    <Comment>
      <Comment.Avatar src="/images/avatar/small/matt.jpg" />
      <Comment.Content>
        <Comment.Author as="a">JIn</Comment.Author>
        <Comment.Metadata>
          <Icon name="map marker alternate" style={{ marginRight: 5 }} /> 서울
          <Icon name="mail" style={{ marginRight: 5, marginLeft: 10 }} />
          jin@naver.com
        </Comment.Metadata>
        <Comment.Text>자기소개</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default OwnerCard;
