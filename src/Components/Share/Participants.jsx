import React from "react";
import { Label } from "semantic-ui-react";
import UserPopUp from "./UserPopUp";

function Participants({ participants }) {
  return (
    <>
      {participants?.map((participant, index) => {
        return (
          <UserPopUp
            key={index}
            userID={participant.id}
            friend={participant}
            notInPrivateChat={true}
          >
            <Label as="a" image>
              <img src={participant.avatarURL} />
              {participant.nickname}
            </Label>
          </UserPopUp>
        );
      })}
    </>
  );
}

export default Participants;
