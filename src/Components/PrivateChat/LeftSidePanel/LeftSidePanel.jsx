import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Segment } from "semantic-ui-react";
import FriendList from "./FriendList";
import ChatList from "./ChatList";
import { userActions, userSelector } from "../../../features/userSlice";

function LeftSidePanel({ currentItem, handleItemClick }) {
  const dispatch = useDispatch();
  const currentFriend = useSelector(userSelector.currentFriend);

  useEffect(() => {
    // 전체 이용자 버튼을 누를 경우 호출
    if (currentItem === "userList") {
      dispatch(userActions.clearCurrentFriend());
    }
  }, [currentItem]);

  useEffect(() => {
    // 채팅 시작 버튼을 누를 경우 채팅 페이지로 이동
    if (currentFriend) {
      handleItemClick(null, { name: "chatList" });
    }
  }, [currentFriend]);

  return (
    <Segment style={{ backgroundColor: "#6DD5FA", height: "90vh" }}>
      <Menu tabular>
        <Menu.Item
          name="friendList"
          active={currentItem === "friendList"}
          onClick={handleItemClick}
          children="친구"
        />
        <Menu.Item
          name="chatList"
          active={currentItem === "chatList"}
          onClick={handleItemClick}
          children="채팅"
        />
        <Menu.Item
          name="userList"
          active={currentItem === "userList"}
          onClick={handleItemClick}
          children="전체 이용자"
        />
      </Menu>
      {currentItem === "friendList" ? <FriendList /> : <ChatList />}
    </Segment>
  );
}

export default LeftSidePanel;
