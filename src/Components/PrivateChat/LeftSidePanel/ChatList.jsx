import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { messagesSelector } from "../../../features/messageSlice";
import {
  privateChatSelector,
  privateChatActions
} from "../../../features/privateChatSlice";
import { userSelector } from "../../../features/userSlice";
import { makePrivateRoomID } from "../../../firebase";
import FriendCard from "./FriendCard";
import { Comment, Segment } from "semantic-ui-react";

function ChatList(props) {
  const dispatch = useDispatch();
  const privateRooms = useSelector(privateChatSelector.privateRooms);
  const currentFriend = useSelector(userSelector.currentFriend);
  const currentUser = useSelector(userSelector.currentUser);
  console.log("privateRooms", privateRooms);

  useEffect(() => {
    // privateRooms in userSlice 에 해당 유저와의 방이 만들어져 있으면 그대로 사용
    // 없을 경우에는 friends in userSlice를 사용하여 새로 만듬(처음 채팅을 시작할 경우)
    // 만약 채팅을 한 글자라도 보낸다면 privateRooms collection에 새로운 document가 만들어지고
    // privateChatSlice의 privateRooms에도 추가되니 2번째 줄에서 임의로 만든 privateRoom을 대체해야 한다.
    if (currentFriend && currentUser) {
      const privateRoomID = makePrivateRoomID(currentUser.id, currentFriend.id);

      const IsInPrivateRoom = isAlreadyInPrivateRooms(privateRoomID);
      if (!IsInPrivateRoom) {
        dispatch(
          privateChatActions.setPrivateRooms([
            {
              id: privateRoomID,
              friendID: currentFriend.id,
              friendNickname: currentFriend.nickname,
              friendAvatarURL: currentFriend.avatarURL
            }
          ])
        );
      }
    }
  }, [currentFriend, currentUser]);

  function isAlreadyInPrivateRooms(privateRoomID) {
    return privateRooms.find(privateRoom => privateRoom.id === privateRoomID);
  }

  return (
    <Segment className="friends__list">
      <Comment.Group>
        {privateRooms.length > 0 &&
          privateRooms.map(friend => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
      </Comment.Group>
    </Segment>
  );
}

export default ChatList;
