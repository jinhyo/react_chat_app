import React, { useState, useCallback, useEffect } from "react";
import { Header, Icon, Divider, Input } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { publicChatSelector } from "../../../features/publicChatSlice";
import { messagesSelector } from "../../../features/messageSlice";
import { userSelector } from "../../../features/userSlice";

function UserListHeader({
  searchMode,
  handleSearchMode,
  setSearchResults,
  searchTerm,
  setSearchTerm
}) {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const totalUsers = useSelector(userSelector.totalUsers);

  useEffect(() => {
    if (!searchMode) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [searchMode]);

  useEffect(() => {
    setSearchTerm("");
    setSearchResults([]);
  }, [currentRoom]);

  const [searchLoading, setSearchLoading] = useState(false);

  const handleChangeSearchTerm = useCallback(
    e => {
      setSearchLoading(true);
      setSearchTerm(e.target.value);
      const searchTerm = e.target.value;
      const regex = new RegExp(searchTerm, "gi");

      const searchResults = totalUsers.filter(user => {
        if (user.nickname.match(regex)) {
          return true;
        }
      });
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
      setSearchResults(searchResults);
    },
    [totalUsers]
  );

  return (
    <div>
      <Header as="h2" dividing textAlign="center">
        <span>이용자 목록</span>
        <Icon
          name="search"
          color="blue"
          onClick={handleSearchMode}
          className="search__icon"
        />
      </Header>

      {/* 검색창 */}
      {searchMode ? (
        <>
          <Input
            fluid
            size="mini"
            icon="search"
            value={searchTerm}
            onChange={handleChangeSearchTerm}
            loading={searchLoading}
          />
          <Divider />
        </>
      ) : null}
    </div>
  );
}

export default UserListHeader;
