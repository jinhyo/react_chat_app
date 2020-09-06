import React from "react";
import { Link } from "react-router-dom";
import { Button, Popup } from "semantic-ui-react";

function UserPopUp({ children, userID }) {
  return (
    <Popup
      wide
      trigger={<a style={{ cursor: "pointer" }}>{children}</a>}
      on="click"
    >
      <Link to={`/profile/${userID}`}>
        <Button size="small" color="blue" content="프로필" fluid />
      </Link>
      <Button size="small" color="green" content="친구추가" fluid />
    </Popup>
  );
}

export default UserPopUp;
