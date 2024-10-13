import React, { useState } from "react";
import { useFormik } from "formik";
import { MdLockOutline } from "react-icons/md";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri"; // Icons for showing/hiding password
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordSchema } from "../schema";
import { Alert, Spinner } from "flowbite-react";
import { clearError, resetPassword } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  console.log(token);
  const { loading, error } = useSelector((state) => state.user.user);

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Initial Values
  const initialValues = {
    password: "",
  };

  // Formik Hook for Handling Form
  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: resetPasswordSchema, // Yup schema for password validation
      onSubmit: (values) => {
        console.log(values);
        dispatch(resetPassword({ values, navigate, toast, token }));
      },
    });

  return (
    <div className="flex justify-center items-center mt-28 bg-gray-50">
      <div className="bg-gray-200 shadow-2xl rounded-lg p-8 w-full max-w-md border border-gray-400">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter a new password to reset your account.
        </p>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <MdLockOutline
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-800"
                }`}
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                id="password"
                placeholder="Enter your new password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {/* Show/Hide Password Icon */}
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <RiEyeOffLine size={24} className="text-blue-500" />
                ) : (
                  <RiEyeLine size={24} className="text-blue-500" />
                )}
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex justify-center items-center text-2xl">
              <Alert color="failure">
                <span className="text-lg font-semibold">{error}</span>
              </Alert>
            </div>
          )}

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            {loading ? (
              <Spinner color="success" aria-label="Success spinner example" />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
