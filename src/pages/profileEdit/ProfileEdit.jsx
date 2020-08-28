import React, { useState, useCallback } from "react";
import Layout from "../../Components/Layout/Layout";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Input,
  Checkbox,
  TextArea
} from "semantic-ui-react";
import firebaseApp from "../../firebase";

function ProfileEdit() {
  const [error, setError] = useState("");
  const [initialState, setInitialState] = useState({
    location: "",
    selfIntro: ""
  });
  const [privateEmail, setPrivateEmail] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleInputChange = useCallback(e => {
    e.persist();
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleEmailCheck = useCallback(() => {
    setPrivateEmail(prev => !prev);
  }, []);

  return (
    <Layout>
      <Grid
        style={{ marginTop: 40 }}
        textAlign="center"
        verticalAlign="middle"
        className="app"
      >
        <Grid.Column width={10}>
          <Form /* onSubmit={handleSubmit} */ size="large">
            <Segment stacked>
              <Header content="emailij" />
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
