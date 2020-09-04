import React from "react";

function Typing({ typingUsers }) {
  return (
    <>
      {typingUsers.map(typingUser => (
        <div key={typingUser.id}>
          <span className="typing__name">
            '{typingUser.nickname}'님이 글을 작성중입니다.
          </span>
          <div className="typing">
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Typing;
