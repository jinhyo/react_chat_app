import React from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../../features/userSlice";
import { Segment, Comment } from "semantic-ui-react";
import UserPopUp from "../../Share/UserPopUp";
import OwnerCard from "../../Share/OwnerCard";

function FriendList() {
  const friends = useSelector(userSelector.friends);

  return (
    <>
      <Segment className="friends__list">
        <Comment.Group>
          {friends.length > 0 &&
            friends.map(friend => (
              <UserPopUp key={friend.id} userID={friend.id} friend={friend}>
                <OwnerCard user={friend} friendList={true} />
              </UserPopUp>
            ))}
        </Comment.Group>
      </Segment>
    </>
  );
}

export default FriendList;
