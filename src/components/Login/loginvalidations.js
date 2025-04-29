import * as yup from "yup";

const validations = yup.object().shape({
  email: yup.string().email("Enter Valid Email").required("This field is required"),
  password: yup
    .string()
    .min(8, "Your password must be at least 8 characters long.")
    .required(),
});

export default validations;
