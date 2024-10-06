import React, { useEffect } from "react";
import { useFormik } from "formik";
import { signUpSchema } from "../schema"; // adjust the path as necessary
import { MdMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Alert, Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, register } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      avatar: null,
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      dispatch(register({ values, navigate,toast }));
    },
  });
  useEffect(() => {
    // Clear error when component unmounts (when navigating away)
    return () => {
      dispatch(clearError());
    };
  }, [dispatch])


  return (
    <div className="flex justify-center items-center mt-20 bg-gray-50">
      <div className=" bg-gray-200 shadow-2xl rounded-lg p-8 w-full max-w-md border border-gray-400">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

        {/* Form Section */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-lg font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              required
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                formik.errors.name && formik.touched.name
                  ? "border-red-500"
                  : "border-gray-800"
              }`}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <MdMailOutline
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                required
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <RiLockPasswordLine
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                required
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirm_password"
              className="block text-lg font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <RiLockPasswordLine
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                required
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm your password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  formik.errors.confirm_password &&
                  formik.touched.confirm_password
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
              />
              {formik.errors.confirm_password &&
                formik.touched.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.confirm_password}
                  </p>
                )}
            </div>
          </div>

          {/* Image Input */}
          <div className="space-y-2">
            <label
              htmlFor="avatar"
              className="block text-lg font-semibold text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={(event) => {
                formik.setFieldValue("avatar", event.currentTarget.files[0]);
              }}
              className={`w-full text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                formik.errors.avatar && formik.touched.avatar
                  ? "border-red-500"
                  : "border-gray-800"
              }`}
            />
            {formik.errors.avatar && formik.touched.avatar && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.avatar}
              </p>
            )}
          </div>
          {error ? (
            <div className="flex justify-center items-center text-2xl">
              <Alert color="failure">
                <span className="text-lg font-semibold">{error}</span>
              </Alert>
            </div>
          ) : null}
          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            {loading ? (<Spinner color="success" aria-label="Success spinner example" />):"Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
