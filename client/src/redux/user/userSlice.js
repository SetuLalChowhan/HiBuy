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
        "Content-Type": "application/json",

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
          "Content-Type": "application/json",

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

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
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
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
