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
    .test("fileSize", "File size is too large (Max: 2MB)", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2 MB limit
    })
    .test(
      "fileType",
      "Unsupported file format (Allowed: jpeg, png)",
      (value) => {
        return (
          value && ["image/jpeg", "image/png"].includes(value.type) // Only JPEG and PNG allowed
        );
      }
    ),
});

export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter your email"),
  password: passwordRules,
});

export const resetPasswordSchema = Yup.object({
  password: passwordRules,
});

export const passwordChangeSchema = Yup.object({
  oldPassword: Yup.string().required("Please enter your old password"),
  newPassword: passwordRules, // Applying the advanced password rules
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

export const editSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  email: Yup.string().email("Invalid email address"),

  avatar: Yup.mixed()
    .nullable() // Allows the field to be null
    .test("fileSize", "File size must be 2MB or less", function (value) {
      // Only validate file size if a file is selected
      if (value) {
        return value.size <= 2 * 1024 * 1024; // 2MB limit
      }
      return true; // Skip validation if no file is selected
    })
    .test(
      "fileType",
      "Only JPEG or PNG formats are supported",
      function (value) {
        // Only validate file type if a file is selected
        if (value) {
          return ["image/jpeg", "image/png"].includes(value.type);
        }
        return true; // Skip validation if no file is selected
      }
    ),
});

export const createProductSchema = Yup.object({
  name: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(50, "Product name cannot exceed 50 characters")
    .required("Please enter the product name"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(1, "Price must be at least 1")
    .max(100000, "Price cannot exceed 100,000")
    .required("Please enter the price"),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .required("Please enter the product description"),

  category: Yup.string()
    .oneOf(["men", "women", "kids"], "Please select a valid category")
    .required("Please select a category"),

  type: Yup.string()
    .oneOf(
      ["topwear", "bottomwear", "winterwear"],
      "Please select a valid type"
    )
    .required("Please select a type"),

  stock: Yup.number()
    .typeError("Stock must be a number")
    .min(1, "Stock must be at least 1")
    .max(10000, "Stock cannot exceed 10,000")
    .required("Please enter the stock quantity"),

  image: Yup.mixed()
    .required("An image file is required")
    .test("fileSize", "File size is too large (Max: 2MB)", (value) => {
      return value && value.size <= 2 * 1024 * 1024; // 2 MB limit
    })
    .test(
      "fileType",
      "Unsupported file format (Allowed: jpeg, png)",
      (value) => {
        return (
          value && ["image/jpeg", "image/png"].includes(value.type) // Only JPEG and PNG allowed
        );
      }
    ),
});
export const editProdcutSchema = Yup.object({
  name: Yup.string()
    .min(2, "Product name must be at least 2 characters")
    .max(50, "Product name cannot exceed 50 characters"),
    

  price: Yup.number()
    .typeError("Price must be a number")
    .min(1, "Price must be at least 1")
    .max(100000, "Price cannot exceed 100,000")
    ,

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    ,

  category: Yup.string()
    .oneOf(["men", "women", "kids"], "Please select a valid category")
    ,

  type: Yup.string()
    .oneOf(
      ["topwear", "bottomwear", "winterwear"],
      "Please select a valid type"
    )
    ,

  stock: Yup.number()
    .typeError("Stock must be a number")
    .min(1, "Stock must be at least 1")
    .max(10000, "Stock cannot exceed 10,000")
    ,

    image: Yup.mixed()
    .nullable() // Allow image to be null (especially during editing)
    .test("fileSize", "File size is too large (Max: 2MB)", (value) => {
      // Only validate if the value is a File (not a URL or undefined)
      return !value || (value instanceof File && value.size <= 2 * 1024 * 1024);
    })
    .test(
      "fileType",
      "Unsupported file format (Allowed: jpeg, png)",
      (value) => {
        // Only validate if the value is a File (not a URL or undefined)
        return !value || (value instanceof File && ["image/jpeg", "image/png"].includes(value.type));
      }
    ),
});
