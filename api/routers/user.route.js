const express = require("express");
const {
  registerUser,
  editProfile,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  passwordChange,
} = require("../controller/auth.controller.js");
const upload = require("../uploads/multerConfig.js");
const {authenticate, isAdmin} = require("../middleware/authMiddleware.js");
const { updateUserRole, deleteUser, searchUsers, getAllUsers } = require("../controller/user.controller.js");
const router = express.Router();

//register
router.post("/register", upload.single("avatar"), registerUser);
//edit-profile
router.put("/edit-profile", authenticate, upload.single("avatar"), editProfile);
//login
router.post("/login", loginUser);
//logout
router.post("/logout", logOutUser);
//forgot-password
router.post("/forgot-password", forgotPassword);
//reset-password
router.put("/reset-password/:token", resetPassword);
//verify-email
router.post("/verify-email", verifyEmail);
//password change
router.put("/password-change", authenticate, passwordChange);
//role change
router.patch("/role", isAdmin, updateUserRole);
//delete user
router.delete("/:userId", isAdmin, deleteUser);
// get all users
router.get("/getAllusers", isAdmin, getAllUsers);

module.exports = router;
