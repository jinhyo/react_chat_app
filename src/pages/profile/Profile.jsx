import React from "react";
import {
  Grid,
  Image,
  Icon,
  Segment,
  Button,
  Message,
  Card
} from "semantic-ui-react";
import { useSelector } from "react-redux";
import Layout from "../../Components/Layout/Layout";
import { userSelector } from "../../features/userSlice";
import { useHistory, Link } from "react-router-dom";

function Profile(props) {
  const history = useHistory();
  const currentUser = useSelector(userSelector.currentUser);
  // if(!currentUser.id){
  //   return (

  //   )
  // }
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
            style={{ height: "550px", backgroundColor: "#fffff0" }}
          >
            <Card centered>
              <Image
                size="medium"
                src={currentUser.avatarURL}
                wrapped
                ui={false}
              />
              <Card.Content>
                <Card.Header>{currentUser.nickname}</Card.Header>
                <Card.Meta textAlign="left">
                  {currentUser.location && (
                    <Icon
                      name="map marker alternate"
                      style={{ marginRight: 5 }}
                    />
                  )}
                  {currentUser?.location}
                </Card.Meta>
                <Card.Meta textAlign="left">
                  {!currentUser.privateEmail && (
                    <a href={`mailto:${currentUser.email}`}>
                      <Icon name="mail" style={{ marginRight: 5 }} />
                      {currentUser.email}
                    </a>
                  )}
                </Card.Meta>
                <Card.Description textAlign="left">
                  {currentUser.selfIntro}
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
            <Button size="small" content="아바타 변경" primary />
            <Link to="/profile/edit">
              <Button size="small" content="프로필 수정" primary />
            </Link>
          </Segment>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default Profile;
