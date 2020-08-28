import { useState, useEffect, useCallback } from "react";

function useFormInput(initialState, validateFunc, cbFunc) {
  const [values, setValues] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const errors = validateFunc(values);
    setErrors(errors);
  }, [values]);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      const noError = Object.keys(errors).length === 0;

      if (noError) {
        try {
          await cbFunc();
        } catch (error) {
          console.error(error);
          if (error.code.includes("email-already-in-use")) {
            setErrors({ email: "이미 사용중인 이메일 입니다." });
          }
          setIsSubmitting(false);
        }
      }
    },
    [errors]
  );

  const handleChange = useCallback(e => {
    e.persist();
    setValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  return {
    values,
    handleChange,
    isSubmitting,
    errors,
    setErrors,
    handleSubmit,
    setIsSubmitting
  };
}

export default useFormInput;
