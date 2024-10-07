import * as Yup from "yup";



export const signUpSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name cannot exceed 25 characters")
    .required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter your password"),
  confirm_password: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must be matched"),
  avatar: Yup.mixed()
    .required("An image file is required")
    .test("fileSize", "File size is too large", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2 MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      );
    }),
});

export const signInSchema = Yup.object({
  email: Yup.string().email().required("Please Enter your email"),
  password: Yup.string().min(6).required("Please Enter your password"),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please Enter your new password"),
});
// export const passwordChangeSchema = Yup.object({
//     oldPassword: Yup.string()
//       .min(6, "Old password must be at least 6 characters long")
//       .required("Please enter your old password"),

//     newPassword: Yup.string()
//       .min(6, "New password must be at least 6 characters long")
//       .required("Please enter your new password"),

//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref('newPassword'), null], "Confirm password must match the new password")
//       .required("Please confirm your new password")
//   });
