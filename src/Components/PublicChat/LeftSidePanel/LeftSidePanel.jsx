import React, { useEffect } from "react";
import { Menu } from "semantic-ui-react";
import JoinedRooms from "./JoinedRooms";
import TotalRooms from "./TotalRooms";

function LeftSidePanel() {
  return (
    <Menu style={{ backgroundColor: "#6DD5FA", height: "90vh" }} vertical>
      <JoinedRooms />
      <TotalRooms />
    </Menu>
  );
}

export default LeftSidePanel;
