import React from "react";
import "./LeftSidePanel.css";
import JoinedRooms from "./JoinedRooms";
import Rooms from "./Rooms";

function LeftSidePanel(props) {
  return (
    <div>
      <JoinedRooms />
      <Rooms />
    </div>
  );
}

export default LeftSidePanel;
