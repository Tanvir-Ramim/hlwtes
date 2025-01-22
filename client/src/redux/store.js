import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { authSlice } from "./authSlice";


const persistConfig = {
  key: "auth", 
  version: 1,
  storage,
};


const persistedReducer = persistReducer(persistConfig, authSlice.reducer);


export const store = configureStore({
  reducer: { auth: persistedReducer }, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export let persistor = persistStore(store);
