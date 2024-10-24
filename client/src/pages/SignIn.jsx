import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInSchema } from "../schema";
import { MdMailOutline } from "react-icons/md";
import { Alert, Button, Modal, Spinner } from "flowbite-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearError, login, forgotPassword } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const SignIn = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loading,loading2, error } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const initialValues = {
    email: "",
    password: "",
  };

  const initialValues1 = {
    email: "",
  };

  const { values, handleChange, handleBlur, touched, errors, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signInSchema,
      onSubmit: (values) => {
        dispatch(login({ values, navigate, toast }));
      },
    });

  const {
    values: values1,
    handleChange: handleChange1,
    handleBlur: handleBlur1,
    touched: touched1,
    errors: errors1,
    handleSubmit: handleSubmit1,
  } = useFormik({
    initialValues: initialValues1,
    validationSchema: signInSchema.pick(["email"]),
    onSubmit: (values1) => {
      dispatch(forgotPassword({ values1, navigate, toast }));
    },
  });

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen relative overflow-hidden">
      {/* Background SVG */}
      <svg
        className="absolute top-0 left-0 h-full w-full"
        viewBox="0 0 1440 320"
      >
        <path
          fill="rgba(255, 255, 255, 0.1)"
          d="M0,256L30,245.3C60,235,120,213,180,202.7C240,192,300,192,360,170.7C420,149,480,107,540,90.7C600,75,660,85,720,101.3C780,117,840,139,900,160C960,181,1020,203,1080,202.7C1140,203,1200,181,1260,170.7C1320,160,1380,160,1410,160L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md border border-gray-200 z-10"
      >
        {/* Header Section */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to continue to your account
        </p>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="absolute left-3 top-3 text-blue-600"
                size={24}
              />
              <input
                className={`w-full pl-12 text-lg rounded-lg border py-3 focus:ring-2 focus:ring-blue-300 transition ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="email"
                name="email"
                required
                id="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Input with Visibility Toggle */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <RiLockPasswordLine
                className="absolute left-3 top-3 text-blue-600"
                size={24}
              />
              <input
                required
                className={`w-full pl-12 pr-10 text-lg rounded-lg border py-3 focus:ring-2 focus:ring-blue-300 transition ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-600">
                Remember Me
              </label>
            </div>
            <div
              onClick={() => {
                handleForgotPassword();
                dispatch(clearError());
              }}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Forgot Password?
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Alert color="failure">
                <span className="text-lg font-semibold">{error}</span>
              </Alert>
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-teal-600 transition duration-300"
          >
            {loading ? (
              <Spinner color="success" aria-label="Success spinner example" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Sign Up Option */}
        <p className="mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </motion.div>

      {/* Modal for Forgot Password */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
              Reset Your Password
            </h3>

            <form onSubmit={handleSubmit1}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <MdMailOutline
                    className="absolute left-3 top-3 text-blue-600"
                    size={24}
                  />
                  <input
                    type="email"
                    required
                    id="email"
                    name="email"
                    className={`w-full pl-12 text-lg rounded-lg border py-3 focus:ring-2 focus:ring-blue-300 transition ${
                      errors1.email && touched1.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    value={values1.email}
                    onChange={handleChange1}
                    onBlur={handleBlur1}
                  />
                  {errors1.email && touched1.email && (
                    <p className="text-red-500 text-sm mt-1">{errors1.email}</p>
                  )}
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading2 ? (
                  <Spinner aria-label="Loading spinner" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </motion.div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SignIn;
