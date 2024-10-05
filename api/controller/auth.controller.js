const User = require("../model/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail.js");

// Register User
const registerUser = async (req, res, next) => {
  // Check for file upload errors
  if (req.fileValidationError) {
    return next(new AppError(req.fileValidationError, 400));
  }

  const { name, email, password, confirm_password } = req.body;
  const avatar = req.file ? req.file.path : null;
   console.log(name,email,password,avatar,confirm_password)
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError("User Already Exists", 400));
    }
    console.log(email,name,password,confirm_password)

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (password != confirm_password) {
      return next(
        new AppError("Password and Confirm Password must be matched..", 400)
      );
    }

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password
      avatar,
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(), // Generate 6-digit code
      verificationExpire: Date.now() + 10 * 60 * 1000, // Code valid for 10 minutes
      isVerified: false, // Initially, the user is not verified
    });

    await user.save();

    // Send the verification code via email
    const htmlMessage = `
      <p>Your verification code is: <strong>${user.verificationCode}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      html: htmlMessage,
      message: "Your verification code.", // Fallback message in case HTML is not supported
    });
    const { password: pass, ...rest } = user._doc;

    res.status(201).json({
      success:true,
      rest,
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Server error", 500)); // Use next to pass the error
  }
};

const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    // Check if the verification code matches and if it's still valid
    if (
      user.verificationCode !== code ||
      user.verificationExpire < Date.now()
    ) {
      return next(new AppError("Invalid or expired verification code", 400));
    }
    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = undefined; // Clear the code
    user.verificationExpire = undefined; // Clear expiration date
    await user.save();
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
    });

    const { password: pass, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      rest,
      token: token,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};
//edit-profile
const editProfile = async (req, res, next) => {
  const { name, email, password } = req.body;
  const avatar = req.file ? req.file.path : null;
  const userId = req.user.userId;

  // Assuming you're using JWT to authenticate users
  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Check if the email is being updated
      if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== userId) {
          return next(new AppError("Email already in use", 400));
        }
        user.email = email; // Update email
      }
      if (name) {
        user.name = name; // Update name
      }

      // if (password) {
      //   const salt = await bcrypt.genSalt(10);
      //   user.password = await bcrypt.hash(password, salt); d
      // }
      if (avatar) {
        user.avatar = avatar; // Update avatar path if a new one is uploaded
      }
      await user.save();
    } else {
      return next(new AppError("Password must be matched"));
    }

    const { password: pass, ...rest } = user._doc;

    res
      .status(201)
      .json({ success: true, rest, message: "Edited Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError(" Invalid email or password", 401));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
    });
    const { password: pass, ...rest } = user._doc;

    res
      .status(201)
      .json({ success: true, rest, message: "Login Successfully" });
  } catch (error) {
    console.error(error);
    return next(new AppError("Server error", 500));
  }
};

const logOutUser = (req, res) => {
  try {
    res.clearCookie("token").status(200).json(" Logged out");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//forgot-password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User with this email does not exist", 404));
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set it on the user model along with an expiration date
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    await user.save();

    // Create a reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset-password/${resetToken}`;

    // HTML message
    const htmlMessage = `
      <p>You have requested a password reset.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
    `;

    try {
      // Send email with reset link
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        html: htmlMessage,
        message: "You requested a password reset.", // Fallback message in case HTML is not supported
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return next(new AppError("Email could not be sent", 500));
    }
  } catch (error) {
    next(new AppError("Server error", 500));
  }
};

const resetPassword = async (req, res, next) => {
  // Hash the token from the URL
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    // Find the user by the token and check if it's still valid
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token should still be valid
    });

    if (!user) {
      return next(new AppError("Invalid or expired token", 400));
    }

    // Get the new password from the request body
    const { password } = req.body;

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Optionally, log the user in by generating a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};

const passwordChange = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return next(new AppError("Incorret Old Password", 401));
    }

    if (newPassword !== confirmPassword) {
      return next(
        new AppError("New Password and Confirm Passoword must be matched"),
        400
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json("Password Changed");
  } catch (error) {
    console.error(error);
    next(new AppError("Server error", 500));
  }
};

module.exports = {
  registerUser,
  editProfile,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  passwordChange,
};
