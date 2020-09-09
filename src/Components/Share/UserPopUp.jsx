import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Popup } from "semantic-ui-react";
import firebaseApp from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { userSelector } from "../../features/userSlice";

function UserPopUp({ children, userID }) {
  const friends = useSelector(userSelector.friends);
  const [loading, setLoading] = useState(false);

  const addFriend = useCallback(async friendID => {
    setLoading(true);
    firebaseApp.addFriend(friendID);
    setLoading(false);
    toast.success("친구 추가 완료");
  }, []);

  const removeFriend = useCallback(async friendID => {
    setLoading(true);
    await firebaseApp.removeFriend(friendID);
    setLoading(false);
    toast.warning("친구 삭제 완료");
  }, []);

  const isMyfriend = useCallback(
    userID => {
      const index = friends.findIndex(friend => friend.id === userID);
      if (index !== -1) {
        return true;
      }
      return false;
    },
    [friends]
  );

  return (
    <Popup
      wide
      trigger={<a style={{ cursor: "pointer" }}>{children}</a>}
      on="click"
    >
      <Link to={`/profile/${userID}`}>
        <Button size="small" color="blue" content="프로필" fluid />
      </Link>
      {isMyfriend(userID) ? (
        <Button
          onClick={() => removeFriend(userID)}
          loading={loading}
          size="small"
          color="red"
          content="친구삭제"
          fluid
        />
      ) : (
        <Button
          onClick={() => addFriend(userID)}
          loading={loading}
          size="small"
          color="green"
          content="친구추가"
          fluid
        />
      )}
    </Popup>
  );
}

export default UserPopUp;
