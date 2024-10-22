import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "product/create-order",
  async ({values,toast}, { rejectWithValue }) => {
    console.log(values);
    try {
      const response = await axios.post("api/orders/create", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order has been Placed Successfully");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
  loading2: false,
  singleOrder: {},
  myOrders: [],
  totalOrders: 0,
  showmore: true,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.singleOrder = action.payload;
      state.error = "";
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = orderSlice.actions;

export default orderSlice.reducer;
