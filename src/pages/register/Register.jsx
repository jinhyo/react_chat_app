import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../Components/Layout/Layout";
import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Input,
  TextArea,
  Checkbox,
} from "semantic-ui-react";
import { toast } from "react-toastify";

import validateRegisterForm from "../../utils/validateRegisterForm";
import firebase from "../../firebase";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../features/userSlice";
import useFormInput from "../../hooks/useFormInput";
import firebaseApp from "../../firebase";

const INITIAL_VALUES = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  location: "",
  selfIntro: "",
};

function Register() {
  const history = useHistory();
  const isLogin = useSelector(userSelector.isLogin);

  const [privateEmail, setPrivateEmail] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const {
    values,
    handleChange,
    isSubmitting,
    errors,
    handleSubmit,
    setIsSubmitting,
    setErrors,
  } = useFormInput(INITIAL_VALUES, validateRegisterForm, createUser);

  useEffect(() => {
    if (isLogin) {
      history.push("/");
    }
  }, [isLogin]);

  async function createUser() {
    const { email, password, nickname, location, selfIntro } = values;

    try {
      const isAvailable = await firebaseApp.checkUniqueNickname(nickname);
      if (!isAvailable) {
        setErrors({ ...errors, nickname: "같은 닉네임이 존재합니다." });
        return;
      }
      setIsSubmitting(true);
      const createdAt = new Date();
      await firebase.createNewUser(
        email,
        password,
        nickname,
        privateEmail,
        location,
        selfIntro,
        createdAt
      );
      // 수정
    } catch (error) {
      console.error(error);
      if (error.code.includes("email-already-in-use")) {
        setErrors({ email: "이미 사용중인 이메일 입니다." });
      }
      setIsSubmitting(false);
    }
  }

  const handleEmailCheck = useCallback(() => {
    setPrivateEmail((prev) => !prev);
  }, []);

  const checkUniqueNickname = useCallback(async () => {
    setCheckLoading(true);
    const isAvailable = await firebase.checkUniqueNickname(values.nickname);

    if (isAvailable) {
      toast.success("사용 가능한 닉네임 입니다.");
      setCheckLoading(false);
    } else {
      setErrors({ ...errors, nickname: "같은 닉네임이 존재합니다." });
      setCheckLoading(false);
    }
  }, [values.nickname]);

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
              <Form.Field>
                <Input
                  fluid
                  name="nickname"
                  icon="user"
                  iconPosition="left"
                  placeholder="닉네임"
                  labelPosition="right"
                  label={
                    <Button
                      onClick={checkUniqueNickname}
                      color="teal"
                      loading={checkLoading}
                    >
                      중복확인
                    </Button>
                  }
                  type="text"
                  value={values.nickname}
                  onChange={handleChange}
                />
                <Message
                  error={!errors.nickname}
                  color="yellow"
                  header={errors.nickname}
                  size="mini"
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="email"
                  label={
                    <Checkbox
                      checked={privateEmail}
                      onChange={handleEmailCheck}
                      color="teal"
                      label="비공개"
                    />
                  }
                  labelPosition="right"
                  icon="mail"
                  iconPosition="left"
                  placeholder="이메일"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                />
                <Message
                  error={!errors.email}
                  color="yellow"
                  header={errors.email}
                  size="mini"
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
                  value={values.password}
                  onChange={handleChange}
                />
                <Message
                  error={!errors.password}
                  color="yellow"
                  header={errors.password}
                  size="mini"
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
                  value={values.passwordConfirm}
                  onChange={handleChange}
                />
                <Message
                  error={!errors.passwordConfirm}
                  color="yellow"
                  header={errors.passwordConfirm}
                  size="mini"
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  name="location"
                  labelPosition="right"
                  icon="map marker alternate"
                  iconPosition="left"
                  placeholder="거주 지역"
                  type="text"
                  value={values.location}
                  onChange={handleChange}
                />
              </Form.Field>

              <Form.Field>
                <TextArea
                  name="selfIntro"
                  placeholder="자기소개"
                  type="text"
                  value={values.selfIntro}
                  onChange={handleChange}
                />
              </Form.Field>

              <Button
                /* disabled={loading}
              loading={loading} */
                color="teal"
                fluid
                size="large"
                compact
                loading={isSubmitting}
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
