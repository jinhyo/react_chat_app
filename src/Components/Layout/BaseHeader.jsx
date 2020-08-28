import React, { useCallback } from "react";
import { Menu, Icon, Image, Header, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../features/userSlice";
import firebaseApp from "../../firebase";

function BaseHeader() {
  const currentUser = useSelector(userSelector.currentUser);
  console.log("currentUser", currentUser);

  const logout = useCallback(() => {
    firebaseApp.logOut();
  }, []);

  return (
    <Menu
      className="baseHeader"
      style={{
        // marginTop: "10px",
        backgroundColor: "#dff9fb",
        fontSize: "1em"
      }}
    >
      <Link to="/" className="item">
        <Icon name="chat" color="teal" />
        <p style={{ fontSize: "1em", fontWeight: "bold" }}>Chat App</p>
      </Link>
      <Link to="/public" className="item">
        <p>공개채팅</p>
      </Link>
      <Link to="/private" className="item">
        <p>개인채팅</p>
      </Link>
      <Menu.Menu position="right">
        {currentUser.id ? (
          <>
            <Header
              className="item"
              as="h5"
              inverted
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <Image
                src={currentUser.avatarURL}
                spaced="right"
                avatar
                size="mini"
              />
              {currentUser.nickname}
            </Header>
            <Menu.Item>
              <Dropdown size="large" icon="cog" className="icon">
                <Dropdown.Menu>
                  <Dropdown.Item>프로필</Dropdown.Item>
                  <Dropdown.Item>배경색</Dropdown.Item>
                  <Dropdown.Item onClick={logout}>로그아웃</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        ) : (
          <>
            <Link to="/register" className="item">
              <p>회원가입</p>
            </Link>
            <Link to="/login" className="item">
              <p>로그인</p>
            </Link>
          </>
        )}
      </Menu.Menu>
    </Menu>
  );
}

export default BaseHeader;
