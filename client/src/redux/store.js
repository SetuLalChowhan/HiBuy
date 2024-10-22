import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import productSlice from "./product/productSlice";
import orderSlice from "./order/orderSlice.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import { createTransform } from "redux-persist";

// Create a transform to exclude specific user fields from persistence
const transform = createTransform(
  (inboundState) => {
    // Destructure to exclude specific fields from user state
    const { users, totalUsers, allUsersDefault, ...rest } = inboundState; // Exclude specific user fields
    return { ...rest }; // Return the modified user state without excluded fields
  },
  (outboundState) => {
    return outboundState; // Return the state as is
  }
);

// Persist configuration for user reducer only
const persistConfig = {
  key: "user", // Key for user persistence
  storage,
  version: 1,
  transforms: [transform], // Apply transform to exclude specified user fields
};

// Combine reducers for both user and product
const rootReducer = combineReducers({
  user: userReducer, // User reducer (with specific values excluded)
  product: productSlice, // Non-persistent product state
  order:orderSlice,
});

// Create a persisted reducer for user state only
const persistedUserReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userReducer, // Only persist the user state
  })
);

// Create store
export const store = configureStore({
  reducer: combineReducers({
    user: persistedUserReducer, // Use the persisted user reducer
    product: productSlice, // Keep productSlice non-persistent
    order:orderSlice,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Create persistor
export const persistor = persistStore(store);
