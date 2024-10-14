import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async ({ values, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/users/register", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success("A verification code has been sent to your email.");

      navigate("/verify-me");

      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const verifyUser = createAsyncThunk(
  "auth/verify-email",
  async ({ values, toast, navigate }, { rejectWithValue }) => {
    try {
      console.log(values);
      const response = await axios.post("api/users/verify-email", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Your email has been successfully verified!.");
      navigate("/");

      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async ({ values, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/users/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Login successful!");
      navigate("/");

      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async ({ toast, navigate }, { rejectWithValue }) => {
    console.log("Hi");

    try {
      const response = await axios.post("api/users/logout", {
        withCredentials: true,
      });
      toast.success("You have been logged out.");
      navigate("/login");

      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ values1, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/users/forgot-password", values1, {
        headers: {
          "Content-Type": "application/json",
        },

        withCredentials: true,
      });
      toast.success(
        "An email has been sent to your inbox to reset your password"
      );

      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ values, toast, navigate, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5173/api/users/reset-password/${token}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      toast.success("Your password has been successfully reset.");
      navigate("/");

      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",

  async ({ query = "", startIndex = 0, toast = "" }, { rejectWithValue }) => {
    try {
      console.log("hllo");
      const response = await axios.get(
        `http://localhost:3000/api/users/getAllusers?query=${query}&startIndex=${startIndex}&limit=10`,
        {
          withCredentials: true,
        }
      );
      return response.data; // Return the fetched data
    } catch (err) {
      toast.success("User not Found");
      return rejectWithValue(err.response.data.message); // Handle error
    }
  }
);
export const userRoleChange = createAsyncThunk(
  "admin/roleChange",

  async ({ userId, isAdmin, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `api/users/role`,
        { userId, isAdmin },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data; // Return the fetched data
    } catch (err) {
      console.log(err);
      toast.error("Unauthorized Access.Please Login again");
      return rejectWithValue(err.response.data.message); // Handle error
    }
  }
);
export const userDeleted = createAsyncThunk(
  "admin/userDelete",

  async ({ userId, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `api/users/${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      toast.success("User deleted successfully ");
      return response.data; // Return the fetched data
    } catch (err) {
      toast.error("Unauthorized Access.Please Login again");
      console.log(err);

      return rejectWithValue(err.response.data.message); // Handle error
    }
  }
);
export const editProfile = createAsyncThunk(
  "editProfile",

  async ({ values, toast }, { rejectWithValue }) => {
    console.log(values);
    try {
      const response = await axios.put(
        `api/users/edit-profile`,
        values,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          withCredentials: true,
        }
      );
      toast.success("Your profile has been successfully updated.");
      return response.data; // Return the fetched data
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err);

      return rejectWithValue(err.response.data.message); // Handle error
    }
  }
);
export const passwordChange = createAsyncThunk(
  "passwordChange",

  async ({ values, toast }, { rejectWithValue }) => {
    console.log(values);
    try {
      const response = await axios.put(
        `api/users/password-change`,
        values,

        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      toast.success("Your password has been successfully updated.");
      return response.data; // Return the fetched data
    } catch (err) {
      console.log(err);

      return rejectWithValue(err.response.data.message); // Handle error
    }
  }
);
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  loading2: false,
  users: [],
  allUsersDefault: null,
  totalUsers: 0,
  showmore: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;

      state.currentUser = action.payload.rest;
      state.error = "";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(verifyUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyUser.fulfilled, (state, action) => {
      state.loading = false;

      state.currentUser = action.payload.rest;
      state.error = "";
    });
    builder.addCase(verifyUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;

      state.currentUser = action.payload.rest;
      state.error = "";
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = "";
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;

      state.currentUser = action.payload.rest;
      state.error = "";
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true; // Set loading to true when the request starts
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false on successful fetch
        state.allUsersDefault = action.payload.total;
        const {
          arg: { startIndex },
        } = action.meta;

        if (startIndex) {
          state.users = [...state.users, ...action.payload.users];
          state.totalUsers = state.users.length;
          if (state.totalUsers % 10 === 0) {
            state.showmore = true;
          } else {
            state.showmore = false;
          }
        } else {
          state.users = action.payload.users;
          state.totalUsers = state.users.length;
          if (state.totalUsers % 10 === 0) {
            state.showmore = true;
          } else {
            state.showmore = false;
          }
        }

        state.error = null; // Clear any previous error
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Set error message
      });
    builder
      .addCase(userRoleChange.pending, (state) => {
        state.loading2 = true; // Set loading to true when the request starts
      })
      .addCase(userRoleChange.fulfilled, (state, action) => {
        state.loading2 = false; // Set loading to false on successful fetch

        const {
          arg: { userId, isAdmin },
        } = action.meta;

        if (userId) {
          // Update the user in the state.users array
          state.users = state.users.map((user) =>
            user._id === userId ? { ...user, isAdmin: isAdmin } : user
          );
        }

        state.error = null; // Clear any previous error
      })
      .addCase(userRoleChange.rejected, (state, action) => {
        state.loading2 = false; // Set loading to false on error
        state.error = action.payload; // Set error message
      });
    builder
      .addCase(userDeleted.pending, (state) => {
        state.loading2 = true; // Set loading to true when the request starts
      })
      .addCase(userDeleted.fulfilled, (state, action) => {
        state.loading2 = false; // Set loading to false on successful fetch

        const {
          arg: { userId },
        } = action.meta;

        if (userId) {
          // Update the user in the state.users array
          state.users = state.users.filter((user) => user._id !== userId);
        }
        state.allUsersDefault = state.users.length;
        state.allUsersDefault -= 1;

        state.error = null; // Clear any previous error
      })
      .addCase(userDeleted.rejected, (state, action) => {
        state.loading2 = false; // Set loading to false on error
        state.error = action.payload; // Set error message
      });
    builder.addCase(editProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;

      state.currentUser = action.payload.rest;
      state.error = "";
    });
    builder.addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(passwordChange.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(passwordChange.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(passwordChange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, setUser } = userSlice.actions;

export default userSlice.reducer;
