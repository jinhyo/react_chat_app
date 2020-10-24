import React, { useCallback, useState, useEffect } from "react";
import {
  Grid,
  Image,
  Icon,
  Segment,
  Button,
  Card,
  Divider
} from "semantic-ui-react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../../Components/Layout/Layout";
import { userSelector } from "../../features/userSlice";
import AvatarModal from "../../Components/Profile/AvatarModal";
import Participants from "../../Components/Share/Participants";
import firebaseApp from "../../firebase";
import RoomPopUp from "../../Components/Profile/RoomPopUp";

function Profile() {
  const history = useHistory();
  const { userID } = useParams();
  console.log("userID", userID);

  const currentUserFriends = useSelector(userSelector.friends);
  const currentUser = useSelector(userSelector.currentUser);
  const isLogin = useSelector(userSelector.isLogin);

  const [userInfo, setUserInfo] = useState(null);
  const [modal, setModal] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (userID) {
      getUserInfo(userID);
    } else {
      setUserInfo(currentUser);
    }
  }, [userID]);

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin]);

  async function getUserInfo(userID) {
    try {
      const userInfo = await firebaseApp.getUser(userID);
      const friends = await firebaseApp.getUserAvatar(userID);

      setFriends(friends);
      setUserInfo(userInfo);
    } catch (error) {
      console.error(error);
    }
  }

  const closeModal = useCallback(() => {
    setModal(false);
  }, []);

  const openModal = useCallback(() => {
    setModal(true);
  }, []);

  const isMyProfile = useCallback(() => {
    return currentUser.id === userInfo.id;
  }, [currentUser, userInfo]);

  // if (!isLogin) return null;
  if (!userInfo) return null;

  return (
    <Layout>
      <Grid
        style={{ marginTop: 40 }}
        textAlign="center"
        verticalAlign="middle"
        className="app"
      >
        <Grid.Column width={10}>
          <Segment
            stacked
            style={{ height: "800px", backgroundColor: "#fffff0" }}
          >
            <Card centered>
              <Image
                size="medium"
                src={isMyProfile() ? currentUser.avatarURL : userInfo.avatarURL}
                wrapped
                ui={false}
              />
              <Card.Content>
                <Card.Header>{userInfo.nickname}</Card.Header>
                <Card.Meta textAlign="left">
                  {userInfo.location && (
                    <Icon
                      name="map marker alternate"
                      style={{ marginRight: 5 }}
                    />
                  )}
                  {userInfo?.location}
                  {userInfo.privateEmail ? (
                    <span style={{ marginLeft: 10 }}>
                      <Icon name="mail" style={{ marginRight: 5 }} />
                      비공개
                    </span>
                  ) : (
                    <a
                      style={{ marginLeft: 10 }}
                      href={`mailto:${userInfo.email}`}
                    >
                      <Icon name="mail" style={{ marginRight: 5 }} />
                      {userInfo.email}
                    </a>
                  )}
                </Card.Meta>

                <Card.Description textAlign="left">
                  {userInfo.selfIntro}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <RoomPopUp roomsIJoined={currentUser.roomsIJoined}>
                  <Icon name="wechat" style={{ marginLeft: 30 }} />
                  {currentUser.roomsIJoined.length}
                </RoomPopUp>
              </Card.Content>
            </Card>

            {isMyProfile() && (
              <>
                <Button
                  size="small"
                  content="아바타 변경"
                  primary
                  onClick={openModal}
                />
                <Link to="/profile/edit">
                  <Button size="small" content="프로필 수정" primary />
                </Link>
              </>
            )}

            <Divider />
            <h3>친구 목록</h3>
            <Participants
              participants={isMyProfile() ? currentUserFriends : friends}
            />
          </Segment>
          <AvatarModal modal={modal} closeModal={closeModal} />
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default Profile;
