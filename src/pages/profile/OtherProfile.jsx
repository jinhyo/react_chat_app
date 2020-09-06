import React, { useCallback, useState, useEffect } from "react";
import {
  Grid,
  Image,
  Icon,
  Segment,
  Button,
  Message,
  Card
} from "semantic-ui-react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../../Components/Layout/Layout";
import { userSelector } from "../../features/userSlice";
import firebaseApp from "../../firebase";

function OtherProfile({ match }) {
  const history = useHistory();
  const { userID } = useParams();
  console.log("userID", userID);

  const isLogin = useSelector(userSelector.isLogin);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  console.log("userInfo", userInfo);

  useEffect(() => {
    if (userID) {
      getUserInfo(userID);
    }
  }, []);

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin]);

  async function getUserInfo(userID) {
    try {
      const userInfo = await firebaseApp.getUser(userID);
      setUserInfo(userInfo);
      setUserLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (!isLogin) return null;

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
            loading={userLoading}
            stacked
            style={{ height: "600px", backgroundColor: "#fffff0" }}
          >
            <Card centered>
              <Image
                size="medium"
                src={userInfo?.avatarURL}
                wrapped
                ui={false}
              />
              <Card.Content>
                <Card.Header>{userInfo?.nickname}</Card.Header>
                <Card.Meta textAlign="left">
                  {userInfo?.location && (
                    <Icon
                      name="map marker alternate"
                      style={{ marginRight: 5 }}
                    />
                  )}
                  {userInfo?.location}
                  {userInfo?.privateEmail ? (
                    <span style={{ marginLeft: 10 }}>
                      <Icon name="mail" style={{ marginRight: 5 }} />
                      비공개
                    </span>
                  ) : (
                    <a
                      style={{ marginLeft: 10 }}
                      href={`mailto:${userInfo?.email}`}
                    >
                      <Icon name="mail" style={{ marginRight: 5 }} />
                      {userInfo?.email}
                    </a>
                  )}
                </Card.Meta>

                <Card.Description textAlign="left">
                  {userInfo?.selfIntro}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Link to="/private">
                  <Icon name="user" />
                  22 명
                </Link>
                <Link to="/public">
                  <Icon name="wechat" style={{ marginLeft: 30 }} />
                  22 개
                </Link>
              </Card.Content>
            </Card>
          </Segment>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default OtherProfile;
