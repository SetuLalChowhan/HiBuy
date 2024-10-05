import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async ({ values, navigate }, { rejectWithValue }) => {
   
    try {
      const response = await axios.post("api/users/register", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
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
  async ({ values, navigate }, { rejectWithValue }) => {
   
    try {
      console.log(values);
      const response = await axios.post("api/users/verify-email", values, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });
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
  async ({ values, navigate }, { rejectWithValue }) => {
   
    try {
      const response = await axios.post("api/users/login", values, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });
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
  async (navigate, { rejectWithValue }) => {
    console.log("Hi")
   
    try {
      const response = await axios.post("api/users/logout", {
       
        withCredentials: true,
      });
      navigate("/login");

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
    })
  }, 
});

export const {clearError} = userSlice.actions;

export default userSlice.reducer;
