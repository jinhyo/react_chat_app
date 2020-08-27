import React from "react";
import "./Login";
import Layout from "../../Components/Layout/Layout";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message
} from "semantic-ui-react";
function Login() {
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
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="이메일"
                type="email"
                /* value={email}
          onChange={e => {
            setEmail(e.target.value);
          }} */
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="비밀번호"
                type="password"
                /* value={password}
          onChange={e => {
            setPassword(e.target.value);
          }} */
              />
              <Form.Field>
                <Button
                  /* disabled={loading}
              loading={loading} */
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
            /* disabled={loading}
              loading={loading} */
            style={{ marginTop: 30 }}
            color="blue"
            size="large"
            compact
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
