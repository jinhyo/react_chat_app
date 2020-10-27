import React, { useState, useCallback, useEffect } from "react";
import { Header, Icon, Divider, Input } from "semantic-ui-react";
import { useSelector } from "react-redux";

import { publicChatSelector } from "../../../features/publicChatSlice";
import { messagesSelector } from "../../../features/messageSlice";

function MessageHeader({
  searchMode,
  handleSearchMode,
  setSearchResults,
  setSearchTerm,
  searchTerm
}) {
  const currentRoom = useSelector(publicChatSelector.currentRoom);
  const messages = useSelector(messagesSelector.publicMessages);

  const [searchLoading, setSearchLoading] = useState(false);

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

  const handleChangeSearchTerm = useCallback(
    e => {
      setSearchLoading(true);
      setSearchTerm(e.target.value);
      const searchTerm = e.target.value;
      const regex = new RegExp(searchTerm, "gi");

      const searchResults = messages.filter(message => {
        if (message.createdBy.nickname.match(regex)) {
          return true;
        } else if (message.type === "message" && message.content.match(regex)) {
          return true;
        }
      });
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
      setSearchResults(searchResults);
    },
    [messages]
  );

  return (
    <div>
      <Header as="h2" dividing textAlign="center">
        <span>{currentRoom.name}</span>
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

export default MessageHeader;
