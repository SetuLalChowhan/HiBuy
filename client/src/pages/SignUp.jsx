import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { signUpSchema } from "../schema"; // Adjust the path as necessary
import { MdMailOutline } from "react-icons/md";
import { RiLockPasswordLine, RiEyeOffLine, RiEyeLine } from "react-icons/ri";
import { Alert, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, register } from "../redux/user/userSlice";
import { toast } from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

const SignUp = () => {
  const { loading, error } = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

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
      if (!imageFileUploadError) {
        dispatch(register({ values, navigate, toast }));
      }
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    uploadImage();
  }, [imageFile]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (
        file.size < 2 * 1024 * 1024 &&
        (file.type === "image/jpeg" || file.type === "image/png")
      ) {
        setImageFile(file);
      } else {
        setImageFileUploadError(
          "File must be a JPEG or PNG and less than 2MB"
        );
      }
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    setImageFileUploadError(null);
    setIsImageUploading(true); // Set uploading state to true

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Optional: You can track progress here if needed
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setIsImageUploading(false); // Reset uploading state on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          formik.setFieldValue("avatar", downloadUrl);
          setIsImageUploading(false); // Reset uploading state after success
        });
      }
    );
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

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-gray-400 z-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h1>

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
                  : "border-gray-300"
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
                    : "border-gray-300"
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
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <RiEyeOffLine size={24} />
                ) : (
                  <RiEyeLine size={24} />
                )}
              </div>
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
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm your password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-12 text-lg rounded-lg border focus:ring focus:ring-blue-200 transition ${
                  formik.errors.confirm_password && formik.touched.confirm_password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <RiEyeOffLine size={24} />
                ) : (
                  <RiEyeLine size={24} />
                )}
              </div>
              {formik.errors.confirm_password && formik.touched.confirm_password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirm_password}
                </p>
              )}
            </div>
          </div>

          {/* Avatar Input */}
          <div className="space-y-2">
            <label
              htmlFor="avatar"
              className="block text-lg font-semibold text-gray-700"
            >
              Upload Avatar
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="text-lg border rounded-lg"
            />
            {imageFileUploadError && (
              <p className="text-red-500 text-sm mt-1">{imageFileUploadError}</p>
            )}
            {isImageUploading && <Spinner />}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isImageUploading}
            className={`w-full py-3 bg-teal-500 text-white rounded-lg font-semibold transition duration-300 hover:bg-teal-600 ${
              loading || isImageUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Spinner size="sm" color="white" /> : "Sign Up"}
          </button>

          {/* Error Alert */}
          {error && (
            <Alert color="failure" className="mt-4">
              {error}
            </Alert>
          )}
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
