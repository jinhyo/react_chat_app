import React, { useState, useCallback, useEffect } from "react";
import Layout from "../../Components/Layout/Layout";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Input,
  Checkbox,
  TextArea
} from "semantic-ui-react";
import firebaseApp from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, userActions } from "../../features/userSlice";
import { useHistory } from "react-router-dom";

function ProfileEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector(userSelector.currentUser);
  const isLogin = useSelector(userSelector.isLogin);

  const [initialState, setInitialState] = useState({
    location: currentUser.location,
    selfIntro: currentUser.selfIntro
  });
  const [privateEmail, setPrivateEmail] = useState(currentUser.privateEmail);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      history.push("/login");
    }
  }, [isLogin]);

  useEffect(() => {
    if (currentUser.id) {
      setInitialState({
        location: currentUser.location,
        selfIntro: currentUser.selfIntro
      });
    }
  }, [currentUser]);

  const handleInputChange = useCallback(e => {
    e.persist();
    if (e.target.name === "selfIntro") {
      if (e.target.value.length < 50) {
        setInitialState(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      }
    } else {
      setInitialState(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  }, []);

  const handleEmailCheck = useCallback(() => {
    setPrivateEmail(prev => !prev);
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      setUpdateLoading(true);
      await firebaseApp.updateProfile(
        currentUser.id,
        privateEmail,
        initialState.location,
        initialState.selfIntro
      );
      dispatch(
        userActions.setCurrentUser({
          ...currentUser,
          privateEmail,
          location: initialState.location,
          selfIntro: initialState.selfIntro
        })
      );
      setUpdateLoading(false);
      history.push("/profile");
    } catch (error) {
      setUpdateLoading(false);
      console.error(error);
    }
  }, [initialState, privateEmail, currentUser]);

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
          <Form onSubmit={handleUpdate} size="large">
            <Segment stacked>
              <Header as="h4" floated="left">
                <Icon name="mail" /> {currentUser.email}
              </Header>
              <Checkbox
                checked={privateEmail}
                onChange={handleEmailCheck}
                color="teal"
                label="비공개"
              />
              <Form.Field>
                <Input
                  fluid
                  name="location"
                  labelPosition="right"
                  icon="map marker alternate"
                  iconPosition="left"
                  placeholder="거주 지역"
                  type="text"
                  value={initialState.location}
                  onChange={handleInputChange}
                />
              </Form.Field>

              <Form.Field>
                <TextArea
                  name="selfIntro"
                  placeholder="자기소개"
                  type="text"
                  value={initialState.selfIntro}
                  onChange={handleInputChange}
                />
              </Form.Field>

              <Button
                color="teal"
                fluid
                size="large"
                compact
                loading={updateLoading}
              >
                수정
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default ProfileEdit;
