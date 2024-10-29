import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { passwordChangeSchema, editSchema } from "../schema";
import { useDispatch, useSelector } from "react-redux";

import { Alert, Button, Modal, Spinner } from "flowbite-react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import { editProfile, passwordChange } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, loading2, error } = useSelector(
    (state) => state.user.user
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const initialValues = {
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: null || "",
  };

  const passwordInitialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: editSchema,
    onSubmit: (values) => {
      // Check if the form values have changed
      if (
        values.name !== initialValues.name ||
        values.email !== initialValues.email ||
        values.avatar
      ) {
        dispatch(editProfile({ values, toast }));
      } else {
        toast.error("No changes detected.");
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: passwordInitialValues,
    validationSchema: passwordChangeSchema,
    onSubmit: (values) => {
      if (!imageFileUploadError) {
        dispatch(passwordChange({ values, toast }));
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (
        file.size < 2 * 1024 * 1024 &&
        (file.type === "image/jpeg" || file.type === "image/png")
      ) {
        setImageFile(file);
        setSelectedImage(URL.createObjectURL(file));
        setImageLoading(true);
        setTimeout(() => {
          setImageLoading(false);
        }, 1500);
      } else {
        setImageFileUploadError("File must be a JPEG or PNG and less than 2MB");
      }
    }
  };

  useEffect(() => {
    uploadImage();
  }, [imageFile]);

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
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white shadow-lg rounded-lg border border-gray-300 h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        My Profile
      </h1>

      {/* Profile Image with upload option */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <img
            src={selectedImage || currentUser.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-48 h-48 rounded-full object-contain border-4 border-blue-500 cursor-pointer"
            onClick={() => document.getElementById("avatarInput").click()}
          />
          {imageLoading && (
            <div className="absolute inset-0 bg-blue-500 opacity-50 rounded-full flex items-center justify-center">
              <Spinner size="md" color="white" />
            </div>
          )}
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imageFileUploadError && (
            <Alert color={"failure"}>{imageFileUploadError}</Alert>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {formik.values.name}
          {currentUser.isVerified && (
            <FaCheckCircle
              className="inline-block text-green-500 ml-2"
              size={20}
            />
          )}
        </h2>
        <p className="text-gray-600">{formik.values.email}</p>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-semibold">
            Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-blue-500" size={20} />
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                formik.errors.name && formik.touched.name
                  ? "border-red-500"
                  : "border-gray-800"
              } focus:ring focus:ring-blue-200 transition`}
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-lg font-semibold">
            Email
          </label>
          <div className="relative">
            <FaEnvelope
              className="absolute left-3 top-3 text-blue-500"
              size={20}
            />
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                formik.errors.email && formik.touched.email
                  ? "border-red-500"
                  : "border-gray-800"
              } focus:ring focus:ring-blue-200 transition`}
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isImageUploading}
          className={`w-full py-3 bg-teal-500 text-white rounded-lg font-semibold transition duration-300 hover:bg-teal-600 ${
            loading || isImageUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <Spinner color="success" aria-label="Profile update spinner" />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>

      {/* Change Password Button */}
      <div className="mt-8 text-center ">
        <Button onClick={() => setShowModal(true)} className="bg-teal-500">
          Change Password
        </Button>
      </div>

      {/* Modal for Password Change */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <h3 className="text-lg font-semibold mb-6">Change Password</h3>
          <form onSubmit={passwordFormik.handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <label
                htmlFor="oldPassword"
                className="block text-lg font-semibold"
              >
                Old Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-3 text-blue-500"
                  size={20}
                />
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    passwordFormik.errors.oldPassword &&
                    passwordFormik.touched.oldPassword
                      ? "border-red-500"
                      : "border-gray-800"
                  } focus:ring focus:ring-blue-200 transition`}
                  placeholder="Enter old password"
                  value={passwordFormik.values.oldPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
                {passwordFormik.errors.oldPassword &&
                  passwordFormik.touched.oldPassword && (
                    <p className="text-red-500 text-sm">
                      {passwordFormik.errors.oldPassword}
                    </p>
                  )}
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-lg font-semibold"
              >
                New Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-3 text-blue-500"
                  size={20}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    passwordFormik.errors.newPassword &&
                    passwordFormik.touched.newPassword
                      ? "border-red-500"
                      : "border-gray-800"
                  } focus:ring focus:ring-blue-200 transition`}
                  placeholder="Enter new password"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
                {passwordFormik.errors.newPassword &&
                  passwordFormik.touched.newPassword && (
                    <p className="text-red-500 text-sm">
                      {passwordFormik.errors.newPassword}
                    </p>
                  )}
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-semibold"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-3 text-blue-500"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    passwordFormik.errors.confirmPassword &&
                    passwordFormik.touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-800"
                  } focus:ring focus:ring-blue-200 transition`}
                  placeholder="Confirm new password"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
                {passwordFormik.errors.confirmPassword &&
                  passwordFormik.touched.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {passwordFormik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>

            {/* Submit Button for Password Change */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-teal-600 transition duration-300"
            >
              {loading2 ? (
                <Spinner color="success" aria-label="Password change spinner" />
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
