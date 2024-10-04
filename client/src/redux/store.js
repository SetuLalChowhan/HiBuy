import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import { createTransform } from "redux-persist";

// Create a transform to exclude the error field from persistence
const transform = createTransform(
  // Transform state on the way to being serialized and persisted
  (inboundState) => {
    // Destructure to exclude the error property
    const { error, ...rest } = inboundState;
    return rest; // Return the modified state without the error
  },
  // Transform state being rehydrated (not modifying it here)
  (outboundState) => {
    return outboundState; // Return the state as is
  },
);

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  transforms: [transform], // Add the transform here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
