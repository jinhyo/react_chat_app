import React, { useState, useCallback, useEffect } from "react";
import { Header, Icon, Divider, Input, Image } from "semantic-ui-react";
import { useSelector } from "react-redux";

import { messagesSelector } from "../../../features/messageSlice";
import { privateChatSelector } from "../../../features/privateChatSlice";

function PrivateMessageHeader({
  searchMode,
  handleSearchMode,
  setSearchResults,
  searchTerm,
  setSearchTerm
}) {
  const messages = useSelector(messagesSelector.privateMesaages);
  const currentPrivateRoom = useSelector(
    privateChatSelector.currentPrivateRoom
  );

  useEffect(() => {
    if (!searchMode) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [searchMode]);

  useEffect(() => {
    setSearchTerm("");
    setSearchResults([]);
  }, [currentPrivateRoom]);

  const [searchLoading, setSearchLoading] = useState(false);

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
      <Header as="h4" dividing textAlign="center">
        {/* <span>private chat</span> */}
        <Image avatar src={currentPrivateRoom.friendAvatarURL} />
        <span className="privateMessage__header">
          {currentPrivateRoom.friendNickname}
        </span>
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

export default PrivateMessageHeader;
