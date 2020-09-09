import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Popup } from "semantic-ui-react";
import firebaseApp from "../../firebase";
import { ToastContainer, toast } from "react-toastify";

function UserPopUp({ children, userID }) {
  const [addLoading, setAddLoading] = useState(false);

  const addFriend = useCallback(async friendID => {
    setAddLoading(true);
    firebaseApp.addFriend(friendID);
    setAddLoading(false);
    toast.success("친구 추가 완료");
  }, []);

  return (
    <Popup
      wide
      trigger={<a style={{ cursor: "pointer" }}>{children}</a>}
      on="click"
    >
      <Link to={`/profile/${userID}`}>
        <Button size="small" color="blue" content="프로필" fluid />
      </Link>
      <Button
        onClick={() => addFriend(userID)}
        loading={addLoading}
        size="small"
        color="green"
        content="친구추가"
        fluid
      />
    </Popup>
  );
}

export default UserPopUp;
