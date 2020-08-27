import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

function BaseHeader(props) {
  return (
    <Menu
      className="baseHeader"
      style={{
        marginTop: "10px",
        backgroundColor: "#dff9fb",
        fontSize: "1em"
      }}
    >
      <Link to="/" className="item">
        <Icon name="chat" color="teal" />
        <p style={{ fontSize: "1em", fontWeight: "bold" }}>Chat App</p>
      </Link>
      <Link to="/" className="item">
        <p>공개채팅</p>
      </Link>
      <Link to="/" className="item">
        <p>개인채팅</p>
      </Link>
      <Menu.Menu position="right">
        <Link to="/register" className="item">
          <p>회원가입</p>
        </Link>
        <Link to="/login" className="item">
          <p>로그인</p>
        </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default BaseHeader;
