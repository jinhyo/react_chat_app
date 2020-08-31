import React from "react";
import { Segment, Header, Comment, Icon } from "semantic-ui-react";
import OwnerCard from "../OwnerCard";
import Participants from "../Participants";

function RoomInfo() {
  return (
    <Segment style={{ backgroundColor: "#fffff0", height: "90vh" }}>
      {/* 세부정보 */}
      <Header style={{ marginTop: 10 }} as="h2" dividing textAlign="center">
        방 이름
        <Header.Subheader style={{ marginTop: 10 }}>
          2019.08.12
        </Header.Subheader>
      </Header>
      <Header as="h5">
        <Icon name="info circle" />
        세부사항
      </Header>
      <p>ㅁㄴㅇㄻㄴ ㅁㄴㅇ ㄹㄴㅁㅇ ㄹ</p>

      {/* 만든사람 */}
      <Header as="h5">
        <Icon name="user circle" />
        만든사람
      </Header>
      <OwnerCard />

      {/* 참가자 */}
      <Comment.Group>
        <Header as="h3" dividing textAlign="center" style={{ marginTop: 10 }}>
          참가자
          <Header.Subheader style={{ marginTop: 10 }}>
            <span>
              <Icon name="users" /> 3명
            </span>
            <span style={{ marginLeft: 40 }}>
              <Icon name="pencil alternate" />
              120개
            </span>
          </Header.Subheader>
        </Header>
        <Participants />
      </Comment.Group>
    </Segment>
  );
}

export default RoomInfo;
