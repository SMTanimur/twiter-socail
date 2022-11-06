import { object, string } from "yup";

export const loginSchema = object().shape({
  email: string().required("Email is required").email("Email is not valid"),
  password: string().min(6, "Password Length must be at least 6"),
});

export const registrationSchema = object().shape({
  username: string()
    .required("Username is Required")
    .min(4, "Username length must be at least 4")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for username"),
  name: string().required("Name is Required"),
  email: string().required("Email is required").email("Email is not valid"),
  password: string()
    .required("Password is required")
    .min(6, "Password Length must be at least 6"),
});
