import React, { useState } from "react";
import { useFormik } from "formik";
import { MdLockOutline } from "react-icons/md";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri"; // Icons for showing/hiding password
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordSchema } from "../schema";
import { Alert, Spinner } from "flowbite-react";
import { clearError, resetPassword } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Importing Framer Motion for animations

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { loading, loading2, error } = useSelector((state) => state.user.user);

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
        dispatch(resetPassword({ values, navigate, toast, token }));
      },
    });

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 h-full w-full"
        viewBox="0 0 1440 320"
      >
        <path
          fill="rgba(255, 255, 255, 0.1)"
          d="M0,256L30,245.3C60,235,120,213,180,202.7C240,192,300,192,360,170.7C420,149,480,107,540,90.7C600,75,660,85,720,101.3C780,117,840,139,900,160C960,181,1020,203,1080,202.7C1140,203,1200,181,1260,170.7C1320,160,1380,160,1410,160L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>
      {/* Animated container */}
      <motion.div
        className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md border border-gray-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header Section */}
        <motion.h1
          className="text-3xl font-bold text-center text-gray-800 mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Reset Password
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Enter a new password to reset your account.
        </motion.p>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Input */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="flex justify-center items-center text-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Alert color="failure">
                <span className="text-lg font-semibold">{error}</span>
              </Alert>
            </motion.div>
          )}

          {/* Reset Password Button */}
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {loading2 ? (
              <Spinner color="success" aria-label="Success spinner example" />
            ) : (
              "Change Password"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
