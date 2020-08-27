import React from "react";
import Layout from "../../Components/Layout/Layout";
import { Link } from "react-router-dom";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Input,
  TextArea,
  Checkbox
} from "semantic-ui-react";

function Register(props) {
  return (
    <Layout>
      <Grid
        style={{ marginTop: 40 }}
        textAlign="center"
        verticalAlign="middle"
        className="app"
      >
        <Grid.Column mobile={5} computer={10}>
          <Form /* onSubmit={handleSubmit} */ size="large">
            <Segment stacked>
              <Form.Field>
                <Input
                  fluid
                  name="nickname"
                  icon="user"
                  iconPosition="left"
                  placeholder="닉네임"
                  labelPosition="right"
                  label={<Button color="teal">중복확인</Button>}
                  type="text"
                  //       value={userName}
                  //       onChange={e => {
                  //   setUserName(e.target.value);
                  // }}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="이메일"
                  label={<Checkbox color="teal" label="비공개" />}
                  labelPosition="right"
                  icon="mail"
                  iconPosition="left"
                  placeholder="이메일"
                  type="email"
                  /* value={email}
          onChange={e => {
            setEmail(e.target.value);
          }} */
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="location"
                  label={<Checkbox color="teal" label="비공개" />}
                  labelPosition="right"
                  icon="map marker alternate"
                  iconPosition="left"
                  placeholder="거주 지역"
                  type="text"
                  /* value={passwordConfirm}
          onChange={e => {
            setPasswordConfirm(e.target.value);
          }} */
                />
              </Form.Field>

              <Form.Field>
                <Input
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
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="passwordConfirm"
                  icon="repeat"
                  iconPosition="left"
                  placeholder="비밀번호 재확인"
                  type="password"
                  /* value={passwordConfirm}
          onChange={e => {
            setPasswordConfirm(e.target.value);
          }} */
                />
              </Form.Field>

              <Form.Field>
                <TextArea
                  fluid
                  name="selfintro"
                  placeholder="자기소개"
                  type="text"
                  /* value={passwordConfirm}
          onChange={e => {
            setPasswordConfirm(e.target.value);
          }} */
                />
              </Form.Field>

              <Button
                /* disabled={loading}
              loading={loading} */
                color="teal"
                fluid
                size="large"
                compact
              >
                회원가입
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </Layout>
  );
}

export default Register;
