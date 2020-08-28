function validateRegisterForm(values) {
  let errors = {};
  if (!values.nickname) {
    errors.nickname = "닉네임을 입력하세요.";
  } else {
    errors.nickname = "";
  }

  if (!values.email) {
    errors.email = "이메일을 입력하세요.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "잘못된 이메일 형식입니다.";
  } else {
    errors.email = "";
  }

  if (!values.password) {
    errors.password = "비밀번호를 입력하세요.";
  } else if (values.password.length < 6) {
    errors.password = "비밀번호는 6자리 이상이어야 합니다..";
  } else {
    errors.password = "";
  }

  if (!values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호를 확인하세요.";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  } else {
    errors.passwordConfirm = "";
  }

  if (
    errors.nickname.length === 0 &&
    errors.email.length === 0 &&
    errors.password.length === 0 &&
    errors.passwordConfirm.length === 0
  ) {
    errors = {};
  }

  return errors;
}

export default validateRegisterForm;
