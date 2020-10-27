import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Grid, Icon, Form, Segment, Button, Message } from "semantic-ui-react";

import Layout from "../../Components/Layout/Layout";
import firebaseApp from "../../firebase";
import { userSelector } from "../../features/userSlice";

function Login() {
  const history = useHistory();
  const isLogin = useSelector(userSelector.isLogin);

  const [error, setError] = useState("");
  const [initialState, setInitialState] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  useEffect(() => {
    if (isLogin) {
      history.push("/");
    }
  }, [isLogin]);

  const handleInputChange = useCallback(e => {
    e.persist();
    setError("");
    setInitialState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setLoginLoading(true);
      await firebaseApp.logIn(initialState.email, initialState.password);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("잘못된 비밀번호 입니다.");
      }
    } finally {
      setLoginLoading(false);
      history.push("/");
    }
  }, [initialState]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setGoogleLoginLoading(true);
      await firebaseApp.logInWithGoogle();
    } catch (error) {
      console.error(error);
      setGoogleLoginLoading(false);
    }
  }, []);

  if (isLogin) return null;

  return (
    <Layout>
      <Grid
        style={{ marginTop: 40 }}
        textAlign="center"
        verticalAlign="middle"
        className="app"
      >
        <Grid.Column width={10}>
          <Form onSubmit={handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="이메일"
                type="email"
                value={initialState.email}
                onChange={handleInputChange}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="비밀번호"
                type="password"
                value={initialState.password}
                onChange={handleInputChange}
              />
              <Form.Field>
                <Message
                  error={!error}
                  color="yellow"
                  header={error}
                  size="mini"
                />
                <Button
                  loading={loginLoading}
                  color="blue"
                  size="large"
                  width="40"
                  compact
                  fluid
                >
                  로그인
                </Button>
              </Form.Field>
            </Segment>
          </Form>
          <Button
            loading={googleLoginLoading}
            style={{ marginTop: 30 }}
            color="blue"
            size="large"
            compact
            onClick={handleGoogleLogin}
          >
            <Icon name="google" />
            구글 로그인
          </Button>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default Login;
