import React, { useCallback, useState, useRef } from "react";
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
          <Label image>{room.name}</Label>
        ))}
      </Popup>
    </>
  );
}

export default RoomPopUp;
