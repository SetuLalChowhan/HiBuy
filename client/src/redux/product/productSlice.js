import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createProduct = createAsyncThunk(
  "product/create-product",
  async ({ values, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.post("api/products/create-product", values, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success("Product Created");
      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);

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
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.singleProduct = action.payload;
      state.allProductsDefault += 1;
      state.error = "";
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
