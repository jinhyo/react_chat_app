import React from "react";
import MessageScreen from "../../Components/PublicChat/MessageScreen";
import MessageForm from "../../Components/PublicChat/MessageForm";
import MessageHeader from "../../Components/PublicChat/MessageHeader";

import "./PublicChat.css";

function OpenChat(props) {
  return (
    <div>
      <MessageHeader />
      <MessageScreen />
      <MessageForm />
    </div>
  );
}

export default OpenChat;
