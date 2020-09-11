import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Popup } from "semantic-ui-react";
import firebaseApp from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { userSelector, userActions } from "../../features/userSlice";
import { privateChatActions } from "../../features/privateChatSlice";

function UserPopUp({ children, userID, friend }) {
  const dispatch = useDispatch();

  const friends = useSelector(userSelector.friends);
  const currentUser = useSelector(userSelector.currentUser);

  const [loading, setLoading] = useState(false);

  const handleAddFriend = useCallback(async () => {
    setLoading(true);
    firebaseApp.addFriend(userID);
    setLoading(false);
    toast.success("친구 추가 완료");
  }, [userID]);

  const handleSetCurrentPrivateRoom = useCallback(() => {
    dispatch(
      privateChatActions.setCurrentPrivateRoom({
        friendID: userID,
        currentUserID: currentUser.id,
        friendNickname: friend.nickname,
        friendAvatarURL: friend.avatarURL
      })
    );
    // 이후 채팅방으로 이동하고 <PrivateMessages />를 뛰움
  }, [userID]);

  const handleRemoveFriend = useCallback(async () => {
    setLoading(true);
    await firebaseApp.removeFriend(userID);
    setLoading(false);
    toast.warning("친구 삭제 완료");
  }, [userID]);

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
        <>
          <Button
            onClick={handleRemoveFriend}
            loading={loading}
            size="small"
            color="red"
            content="친구삭제"
            fluid
          />
          <Button
            onClick={handleSetCurrentPrivateRoom}
            size="small"
            color="green"
            content="채팅 시작"
            fluid
          />
        </>
      ) : (
        <Button
          onClick={handleAddFriend}
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
