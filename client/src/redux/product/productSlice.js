import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createProduct = createAsyncThunk(
  "product/create-product",
  async ({ values, toast }, { rejectWithValue }) => {
    console.log(values);
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
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ values }, { rejectWithValue }) => {
    try {
      const {
        category = "",
        type = "",
        search = "",
        minPrice = "",
        maxPrice = "",
        sortOption = "",
        startIndex = "",
        limit = "",
      } = values;

      console.log(values);

      const response = await axios.get(
        `http://localhost:3000/api/products/all-products`,
        {
          params: {
            sortOrder: sortOption,
            latest: sortOption === "latest" ? "true" : undefined, // Only include if true
            bestSeller: sortOption === "bestSeller" ? "true" : undefined, // Only include if true
            category: category || "", // Fallback to empty string
            type: type || "", // Fallback to empty string
            search: search || "", // Fallback to empty string
            minPrice: minPrice || "", // Fallback to empty string
            maxPrice: maxPrice || "", // Fallback to empty string
            startIndex: startIndex || 0, // Default to 0
            limit: limit, // Default to 10
          },
          withCredentials: true,
        }
      );

      return response.data; // Ensure your API returns the data in the expected format
    } catch (err) {
      console.log(err);
      console.error(err.response?.data?.message || "Failed to fetch products");
      return rejectWithValue(
        err.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "product/single-product",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const editProduct = createAsyncThunk(
  "product/edit-product",
  async ({ values, id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/${id}`,
        values,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          withCredentials: true,
        }
      );
      toast.success("Product Edited");

      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "product/delete-product",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Product Deleted");

      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const addReview = createAsyncThunk(
  "product/add-review",
  async ({ id, toast, review }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/products/reviews/${id}`,
        review,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Review Added");

      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const editReview = createAsyncThunk(
  "product/edit-review",
  async ({ id, toast, review }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/reviews/${id}`,
        review,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Review edited");

      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const deleteReview = createAsyncThunk(
  "product/delete-review",
  async ({ id, id2, toast }, { rejectWithValue }) => {
    const value = { reviewId: id2 };
    console.log(value);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/products/reviews/${id}/${id2}`,

        {
          withCredentials: true,
        }
      );
      toast.success("Review Deleted");

      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);

const initialState = {
  products: [],
  allProducts: [],
  cart: [],
  error: null,
  loading: false,
  loading2: false,
  singleProduct: {},
  allProductsDefault: null,
  totalProducts: 0,
  showmore: false,
  fixedTotal:0
};

const productSlice = createSlice({
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
      state.allProductsDefault = action.payload.totalProducts;
      state.fixedTotal = action.payload.total;
      const {
        arg: {
          values: { startIndex },
        },
      } = action.meta;
      if (startIndex) {
        state.products = [...state.products, ...action.payload.products];
        state.totalProducts = state.products.length;
        if (state.totalProducts % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }
      } else {
        state.products = action.payload.products;
        state.totalProducts = state.products.length;
        if (state.totalProducts % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }
      }

      state.allProducts = action.payload.products;

      state.error = null;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.allProductsDefault = 0;
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.singleProduct = action.payload;
      state.error = "";
    });
    builder.addCase(getSingleProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(editProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.singleProduct = action.payload;
      state.error = "";
    });
    builder.addCase(editProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading2 = false;
      const {
        arg: { id },
      } = action.meta;
      console.log(id);
      state.products = state.products.filter((product) => product._id !== id);
      state.allProductsDefault -= 1;
      state.totalProducts = state.products.length;
      if (state.totalProducts % 10 == 0) {
        state.showmore = true;
      } else {
        state.showmore = false;
      }
      state.error = "";
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });
    builder.addCase(addReview.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.loading2 = false;
      const isReviewd = state.singleProduct.reviews.find((review) => {
        return (
          review.userId.toString() === action.payload.review.userId.toString()
        );
      });
      console.log(action.payload);
      if (!isReviewd) {
        console.log("hi");
        state.singleProduct.reviews.push(action.payload.review);
        state.singleProduct.rating = action.payload.rating;
      }
    });
    builder.addCase(addReview.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });

    builder.addCase(editReview.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(editReview.fulfilled, (state, action) => {
      state.loading2 = false;
      state.singleProduct.reviews = state.singleProduct.reviews.map(
        (review) => {
          if (
            review.userId.toString() === action.payload.review.userId.toString()
          ) {
            return { ...review, comment: action.payload.review.comment };
          } else {
            return review;
          }
        }
      );

      state.singleProduct.rating = action.payload.rating;
    });
    builder.addCase(editReview.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });
    builder.addCase(deleteReview.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      state.loading2 = false;
      const {
        arg: { id2 },
      } = action.meta;

      state.singleProduct.reviews = state.singleProduct.reviews.filter(
        (review) => review._id !== id2
      );

      state.singleProduct.rating = action.payload.rating;
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });
  },
});

export const {} = productSlice.actions;

export default productSlice.reducer;
