import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const createProduct = createAsyncThunk(
//   "product/create-product",
//   async ({ values, toast }, { rejectWithValue }) => {
//     console.log(values);
//     try {
//       const response = await axios.post("api/products/create-product", values, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true,
//       });
//       toast.success("Product Created");
//       return response.data;
//     } catch (err) {
//       toast.error(err.response.data.message);
//       console.log(err.response.data.message);
//       return rejectWithValue(err.response.data.message);
//     }
//   }
// );


const initialState = {
  orders: [],
  loading:false,
  error:null,
  loading2:false,
  singleOrder:{},
  myOrders:[],
  totalOrders:0,
  showmore: true,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    // builder.addCase(createProduct.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(createProduct.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.singleProduct = action.payload;
    //   state.error = "";
    // });
    // builder.addCase(createProduct.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
    
  },
});

export const { } =
   orderSlice.actions;

export default orderSlice.reducer;
