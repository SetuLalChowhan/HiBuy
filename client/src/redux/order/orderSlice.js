import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "product/create-order",
  async ({ values, toast }, { rejectWithValue }) => {
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
export const fetchOrders = createAsyncThunk(
  "product/fetchOrders",
  async ({ values }, { rejectWithValue }) => {
    try {
      const {
       query="",
       sort="",
       status="",
       startIndex=0,
       limit,
      } = values;

      console.log(values);

      const response = await axios.get(
        `http://localhost:3000/api/orders/allOrders`,
        {
          params: {
            query:query || "",
            sort:sort || "",
            status:status || "",
            startIndex:startIndex || 0,
            limit:limit 
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

const initialState = {
  orders: [],
  loading: false,
  error: null,
  loading2: false,
  singleOrder: {},
  myOrders: [],
  totalOrders: 0,
  allOrders:0,
  showmore: false,
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
      const {
        arg: {
          values: { startIndex },
        },
      } = action.meta;
      if(startIndex){
        state.orders =[...state.orders,...action.payload.orders]
        state.allOrders =state.orders.length
        if (state.allOrders % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }
        
      }
      else{
        state.orders = action.payload.orders;
        state.allOrders = state.orders.length;
        if (state.allOrders % 10 === 0) {
          state.showmore = true;
        } else {
          state.showmore = false;
        }

      }
      state.error = "";
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const {} = orderSlice.actions;

export default orderSlice.reducer;