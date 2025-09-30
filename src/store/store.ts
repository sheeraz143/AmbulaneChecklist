import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./adminAuthSlice";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
  },
});

// ✅ Export these types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
