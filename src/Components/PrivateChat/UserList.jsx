import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";

import UserListHeader from "./UserListHeader";

function UserList() {
  const dispatch = useDispatch();

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <UserListHeader
          searchMode={searchMode}
          handleSearchMode={handleSearchMode}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
        />
        <Segment className={searchMode ? "messages__search" : "messages"}>
          {/* <OwnerCard /> */}
        </Segment>
      </Comment.Group>
    </Segment>
  );
}

export default UserList;
