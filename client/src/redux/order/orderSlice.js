import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetCart } from "../user/userSlice";

export const createOrder = createAsyncThunk(
  "product/create-order",
  async ({ values, toast,navigate }, { dispatch, rejectWithValue }) => {
    console.log(values);
    try {
      const response = await axios.post("api/orders/create", values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Order has been Placed Successfully");
      navigate("/")
      dispatch(resetCart());
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const fetchOrders = createAsyncThunk(
  "product/fetchOrders",
  async ({ values }, { rejectWithValue }) => {
    try {
      const {
        query = "",
        sort = "",
        status = "",
        startIndex = 0,
        limit,
      } = values;

      const response = await axios.get(
        `http://localhost:3000/api/orders/allOrders`,
        {
          params: {
            query: query || "",
            sort: sort || "",
            status: status || "",
            startIndex: startIndex || 0,
            limit: limit,
          },
          withCredentials: true,
        }
      );

      return response.data; // Ensure your API returns the data in the expected format
    } catch (err) {
      console.log(err);
      // toast.error(err.response.data.message);
      console.error(err.response?.data?.message || "Failed to fetch products");
      return rejectWithValue(
        err.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const changeStatus = createAsyncThunk(
  "product/change-status",
  async ({ values2, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`api/orders/order/${id}`, values2, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const deleteOrder = createAsyncThunk(
  "product/delete-order",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`api/orders/order/${id}`, {
        withCredentials: true,
      });

      toast.success("Order Deleted");
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data.message);
      return rejectWithValue(err.response.data.message);
    }
  }
);
export const myOrderList = createAsyncThunk(
  "product/my-orders",
  async ({ values }, { rejectWithValue }) => {
    const { startIndex = 0, limit } = values;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/orders/my-orders`,
        {
          params: {
            startIndex: startIndex || 0,
            limit: limit,
          },
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
const initialState = {
  orders: [],
  loading: false,
  error: null,
  loading2: false,
  singleOrder: {},
  myOrders: [],
  totalOrders: null,
  allOrders: 0,
  showmore: false,
  fixedTotalOrder: 0,
  myOrders: [],
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
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.totalOrders = action.payload.totalOrders;
      state.fixedTotalOrder = action.payload.total;
      const {
        arg: {
          values: { startIndex },
        },
      } = action.meta;
      if (startIndex) {
        state.orders = [...state.orders, ...action.payload.orders];
        state.allOrders = state.orders.length;
        if (state.allOrders % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }
      } else {
        state.orders = action.payload.orders;
        state.allOrders = state.orders.length;
        if (state.allOrders % 10 === 0) {
          console.log("hi");
          state.allOrders === 0
            ? (state.showmore = false)
            : (state.showmore = true);
        } else {
          state.showmore = false;
        }
      }
      state.error = "";
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.totalOrders = 0;
      state.error = action.payload;
    });
    builder.addCase(changeStatus.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(changeStatus.fulfilled, (state, action) => {
      state.loading2 = false;
      const {
        arg: { id },
      } = action.meta;

      state.orders = state.orders.map((order) =>
        order._id === id ? action.payload : order
      );

      state.error = "";
    });
    builder.addCase(changeStatus.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });
    builder.addCase(deleteOrder.pending, (state) => {
      state.loading2 = true;
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.loading2 = false;
      const {
        arg: { id },
      } = action.meta;

      state.orders = state.orders.filter((order) => order._id !== id);
      state.allOrders = state.orders.length;
      state.totalOrders -= 1;

      if (state.allOrders % 10 == 0) {
        state.showmore = true;
      } else {
        state.showmore = false;
      }

      state.error = "";
    });
    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.loading2 = false;
      state.error = action.payload;
    });
    builder.addCase(myOrderList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(myOrderList.fulfilled, (state, action) => {
      state.loading = false;
      const {
        arg: {
          values: { startIndex },
        },
      } = action.meta;
      if (startIndex) {
        state.myOrders = [...state.myOrders, ...action.payload];
        state.allOrders = state.orders.length;
        if (state.allOrders % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }
      } else {
        state.myOrders = action.payload;
        state.allOrders = state.orders.length;
        if (state.allOrders % 10 === 0) {
          state.allOrders === 0
            ? (state.showmore = false)
            : (state.showmore = true);
        } else {
          state.showmore = false;
        }
      }
      state.error = "";
    });
    builder.addCase(myOrderList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = orderSlice.actions;

export default orderSlice.reducer;
