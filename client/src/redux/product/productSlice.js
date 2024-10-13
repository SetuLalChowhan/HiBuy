import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const register = createAsyncThunk(
//   "auth/register",
//   async ({ values, navigate, toast }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("api/users/register", values, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true,
//       });
//       toast.success("A verification code has been sent to your email.");

//       navigate("/verify-me");

//       return response.data;
//     } catch (err) {
//       console.log(err.response.data.message);
//       return rejectWithValue(err.response.data.message);
//     }
//   }
// );


const initialState = {
  products: [],
  error: null,
  loading: false,
  singleProduct: {},
  allProductsDefault: 0,
  totalProducts: 0,
  showmore: true,
};

const userSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(register.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(register.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.currentUser = action.payload.rest;
    //   state.allUsersDefault = state.users.length += 1;
    //   state.error = "";
    // });
    // builder.addCase(register.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
  },
});

export const {  } = userSlice.actions;

export default userSlice.reducer;
