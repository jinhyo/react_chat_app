import React from "react";
import { Label } from "semantic-ui-react";

function Participants(props) {
  return (
    <>
      <Label as="a" image>
        <img src="/images/avatar/small/joe.jpg" />
        Joe
      </Label>
      <Label as="a" image>
        <img src="/images/avatar/small/elliot.jpg" />
        Elliot
      </Label>
      <Label as="a" image>
        <img src="/images/avatar/small/stevie.jpg" />
        Stevie
      </Label>
    </>
  );
}

export default Participants;
