import React from "react";
import { Popup, Label } from "semantic-ui-react";

function RoomPopUp({ children, roomsIJoined }) {
  return (
    <>
      <Popup
        wide
        trigger={<span style={{ cursor: "pointer" }}>{children}</span>}
        on="click"
      >
        {roomsIJoined?.map(room => (
          <Label key={room.id} image>
            {room.name}
          </Label>
        ))}
      </Popup>
    </>
  );
}

export default RoomPopUp;
