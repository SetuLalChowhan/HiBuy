import * as Yup from "yup";

// Enhanced password validation with stricter rules
const passwordRules = Yup.string()
  .min(8, "Password must be at least 8 characters long")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[^\w]/, "Password must contain at least one special character")
  .required("Please enter your password");

export const signUpSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name cannot exceed 25 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Please enter your name"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter your email"),

  password: passwordRules,

  confirm_password: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),

  avatar: Yup.mixed()
    .required("An image file is required")
    .test("fileSize", "File size is too large", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2 MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      return value && ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});

export const signInSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Please enter your email"),
  password: passwordRules,
});

export const resetPasswordSchema = Yup.object({
  password: passwordRules,
});

// Uncomment if you need this schema for password change
// export const passwordChangeSchema = Yup.object({
//   oldPassword: passwordRules.required("Please enter your old password"),
//   newPassword: passwordRules.required("Please enter your new password"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
//     .required("Please confirm your new password")
// });
