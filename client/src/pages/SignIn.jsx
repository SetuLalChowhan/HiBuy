import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInSchema } from "../schema";
import { MdMailOutline } from "react-icons/md";
import { Alert, Button, Modal, Spinner } from "flowbite-react";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch,useSelector } from "react-redux";
import { clearError, login } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";


const SignIn = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const {loading,error} = useSelector((state)=>state.user)
  const dispatch =useDispatch()

  useEffect(() => {
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch])

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
        console.log(values)
        dispatch(login({values,navigate,toast}))
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
    validationSchema: signInSchema.pick(["email"]), // Only validate email for this form
    onSubmit: (values1) => {
    },
  });

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  return (
    <div className="flex justify-center items-center mt-28 bg-gray-50">
      <div className="bg-gray-200 shadow-2xl rounded-lg p-8 w-full max-w-md border border-gray-400">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Please login to your account.
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
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition
                  ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-gray-800"
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
              {errors.email && touched.email ? (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              ) : null}
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
            <div className="relative ">
              <RiLockPasswordLine
                className="absolute left-3 top-3 text-blue-500"
                size={24}
              />
              <input
                required
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition
                  ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-800"
                  }`}
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              ) : null}
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
              onClick={handleForgotPassword}
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Forgot Password?
            </div>
          </div>
          {error ? (
            <div className="flex justify-center items-center text-2xl">
              <Alert color="failure">
                <span className="text-lg font-semibold">{error}</span>
              </Alert>
            </div>
          ) : null}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            {loading ? (<Spinner color="success" aria-label="Success spinner example" />):"Login"}
          </button>
        </form>

        {/* Sign Up Option */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Modal for Forgot Password */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-gray-400">
              Reset Your Password
            </h3>

            {/* Email Form Section */}
            <form onSubmit={handleSubmit1}>
              <div className="mb-4">
                <label
                  htmlFor="emailModal"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <MdMailOutline
                    className="absolute left-3 top-3 text-blue-500"
                    size={24}
                  />
                  <input
                    type="email"
                    required
                    id="email" // Change this to be unique
                    className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition
                      ${
                        errors1.email && touched1.email
                          ? "border-red-500"
                          : "border-gray-800"
                      }`}
                    placeholder="Enter your email"
                    value={values1.email}
                    onChange={handleChange1}
                    onBlur={handleBlur1}
                  />
                  {errors1.email && touched1.email ? (
                    <p className="text-red-500 text-sm mt-1">{errors1.email}</p>
                  ) : null}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center gap-4">
                <Button color="blue" type="submit">
                  Submit
                </Button>
                <Button
                  color="blue"
                  outline
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SignIn;
