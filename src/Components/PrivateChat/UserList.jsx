import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Comment, Segment, Input, Divider } from "semantic-ui-react";

import UserListHeader from "./UserListHeader";
import firebaseApp from "../../firebase";
import { userActions, userSelector } from "../../features/userSlice";
import OwnerCard from "../Share/OwnerCard";
import UserPopUp from "../Share/UserPopUp";

function UserList() {
  const dispatch = useDispatch();

  const currentUser = useSelector(userSelector.currentUser);
  const totalUsers = useSelector(userSelector.totalUsers);
  console.log("totalUsers", totalUsers);

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

        <Segment className={searchMode ? "userList__search" : "userList"}>
          <Comment.Group>
            {totalUsers.length > 0 &&
              totalUsers.map(user => (
                <UserPopUp key={user.id} userID={user.id}>
                  <OwnerCard user={user} rightSide={false} />
                </UserPopUp>
              ))}
          </Comment.Group>
        </Segment>
      </Comment.Group>
    </Segment>
  );
}

export default UserList;
