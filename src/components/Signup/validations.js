import * as yup from "yup";

const validations = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("This field is required"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters long.")
    .required(),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Your passwords do not match")
    .required(),
  country: yup
    .string(),
  username: yup
    .string()
    .required("This field is required")
    .min(3, "Your username must be at least 3 characters long.")
    .max(20, "Your username must not exceed 20 characters.")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
});

export default validations;
