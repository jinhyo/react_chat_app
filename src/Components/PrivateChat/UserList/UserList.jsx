import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";

import UserListHeader from "./UserListHeader";
import { userActions, userSelector } from "../../../features/userSlice";
import OwnerCard from "../../Share/OwnerCard";
import UserPopUp from "../../Share/UserPopUp";

// <App/>에서 totlaUsers 확보
function UserList() {
  const totalUsers = useSelector(userSelector.totalUsers);

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchMode = useCallback(() => {
    setSearchMode(prev => !prev);
  }, []);

  const displayUsers = useCallback(() => {
    if (searchResults.length > 0 || searchMode) {
      return searchResults.map(user => (
        <UserPopUp key={user.id} userID={user.id} friend={user}>
          <OwnerCard user={user} />
        </UserPopUp>
      ));
    } else if (!searchTerm) {
      return totalUsers.map(user => (
        <UserPopUp key={user.id} userID={user.id} friend={user}>
          <OwnerCard user={user} />
        </UserPopUp>
      ));
    }
  }, [searchResults, totalUsers]);

  return (
    <Segment style={{ height: "90vh" }}>
      <Comment.Group>
        {/* 헤더 */}
        <UserListHeader
          searchMode={searchMode}
          handleSearchMode={handleSearchMode}
          setSearchResults={setSearchResults}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Segment className={searchMode ? "userList__search" : "userList"}>
          <Comment.Group>{displayUsers()}</Comment.Group>
        </Segment>
      </Comment.Group>
    </Segment>
  );
}

export default UserList;
