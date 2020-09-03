import React from "react";
import { Label } from "semantic-ui-react";

function Participants({ participants }) {
  return (
    <>
      {participants?.map((participant, index) => {
        return (
          <Label key={index} as="a" image>
            <img src={participant.avatarURL} />
            {participant.nickname}
          </Label>
        );
      })}
    </>
  );
}

export default Participants;
