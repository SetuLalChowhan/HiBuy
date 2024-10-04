import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "auth/register",
  async ( {values,navigate}, { rejectWithValue }) => {
    console.log(values)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        values ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
          
      );
      navigate("/verify-you")
     
      return response.data;
    } catch (err) {
        console.log(err.response.data.message)
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = "";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
