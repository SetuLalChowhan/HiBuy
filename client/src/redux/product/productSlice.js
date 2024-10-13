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


export const fetchProducts = createAsyncThunk(
    "product/fetchProducts",
    async ({ values }, { rejectWithValue }) => {
      try {
        const { category="", type="", search="", minPrice="", maxPrice="", sortOption="", startIndex="", limit="",latest="",sortOrder="" } = values;
  
   console.log(sortOption)
  
        const response = await axios.get(`http://localhost:3000/api/products/all-products`, {
          params: {
            sortOrder:sortOption,
            latest: sortOption==="latest"? 'true' : undefined,  // Only include if true
            category: category || '',               // Fallback to empty string
            type: type || '',                       // Fallback to empty string
            search: search || '',                   // Fallback to empty string
            minPrice: minPrice || '',               // Fallback to empty string
            maxPrice: maxPrice || '',               // Fallback to empty string
            startIndex: startIndex || 0,            // Default to 0
            limit: limit || 10,                     // Default to 10
          },
          withCredentials: true,
        });
  
      
        return response.data; // Ensure your API returns the data in the expected format
      } catch (err) {
        console.log(err)
        console.error(err.response?.data?.message || "Failed to fetch products");
        return rejectWithValue(err.response?.data?.message || "An error occurred");
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
    builder.addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products; // Assuming your API returns a `products` array
        state.totalProducts = action.payload.totalProducts; // Assuming your API returns `totalProducts`
        state.error = null;
      });
      builder.addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
