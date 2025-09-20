import { api } from "@/services/api";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import sweetsReducer from "./reducers/sweetReducer";
import { sweetsApi } from "@/services/sweetApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [sweetsApi.reducerPath]: sweetsApi.reducer,
    auth: authReducer,
    sweets: sweetsReducer,
  },

  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(api.middleware, sweetsApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
