import React, { useCallback, useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popup } from "semantic-ui-react";
import { toast } from "react-toastify";

import firebaseApp from "../../firebase";
import { userSelector, userActions } from "../../features/userSlice";
import { privateChatActions } from "../../features/privateChatSlice";

function UserPopUp({ children, userID, friend, notInPrivateChat }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const clickRef = useRef();

  const friends = useSelector(userSelector.friends);
  const currentUser = useSelector(userSelector.currentUser);

  const [loginStateDone, setLoginStateDone] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddFriend = useCallback(async () => {
    setLoading(true);
    setLoginStateDone(false);
    await firebaseApp.addFriend(userID);
    await firebaseApp.checkUserLoginStatus(userID, snap => {
      setTimeout(() => {
        dispatch(
          userActions.setLoginStatus({
            index: null,
            userID,
            isLogin: snap.exists()
          })
        );
        setLoginStateDone(true);
      }, 1000);
    });

    setLoading(false);
    toast.success("친구 추가 완료");
  }, [userID, friends]);

  const handleSetCurrentPrivateRoom = useCallback(() => {
    dispatch(
      privateChatActions.setCurrentPrivateRoom({
        friendID: userID,
        currentUserID: currentUser.id,
        friendNickname: friend.nickname,
        friendAvatarURL: friend.avatarURL
      })
    );

    if (notInPrivateChat) {
      history.push("/private");
    }
    // 이후 채팅방으로 이동하고 <PrivateMessages />를 뛰움
  }, [userID]);

  const closePopUp = useCallback(() => {
    if (clickRef.current) {
      clickRef.current.click();
    }
  }, []);

  const handleRemoveFriend = useCallback(async () => {
    closePopUp();
    await firebaseApp.removeFriend(userID);
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
    <>
      <Popup
        wide
        trigger={<span style={{ cursor: "pointer" }}>{children}</span>}
        on="click"
        // open={false}
      >
        <Link to={`/profile/${userID}`}>
          <Button
            onClick={closePopUp}
            size="small"
            color="blue"
            content="프로필"
            fluid
          />
        </Link>
        {isMyfriend(userID) ? (
          <>
            <Button
              onClick={handleRemoveFriend}
              loading={loading}
              size="small"
              color="red"
              content="친구삭제"
              disabled={!loginStateDone}
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
          currentUser.id !== userID && (
            <Button
              onClick={handleAddFriend}
              loading={loading}
              size="small"
              color="green"
              content="친구추가"
              fluid
            />
          )
        )}
      </Popup>
      <span ref={clickRef}></span>
    </>
  );
}

export default UserPopUp;
