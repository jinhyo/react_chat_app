import React, { useCallback } from "react";
import { Menu, Icon, Image, Header, Dropdown } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { userSelector, userActions } from "../../features/userSlice";
import firebaseApp from "../../firebase";

function BaseHeader() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userSelector.currentUser);

  const logout = useCallback(() => {
    firebaseApp.logOut();
    dispatch(userActions.clearUser());
    history.push("/");
  }, []);

  const linkToPrivate = useCallback(() => {
    if (!currentUser.id) {
      return alert("로그인이 필요합니다.");
    }
    history.push("/private");
  }, [currentUser]);

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
      <a className="item" onClick={linkToPrivate}>
        개인채팅
      </a>
      <Menu.Menu position="right">
        {currentUser.id ? (
          <>
            <Header
              className="item"
              as="h5"
              inverted
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <Link to="/profile">
                <Image
                  src={currentUser.avatarURL}
                  spaced="right"
                  avatar
                  size="mini"
                />
                {currentUser.nickname}
              </Link>
            </Header>
            <Menu.Item>
              <Dropdown size="large" icon="cog" className="icon">
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to="/profile">
                      <span style={{ color: "black" }}>프로필</span>
                    </Link>
                  </Dropdown.Item>
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
