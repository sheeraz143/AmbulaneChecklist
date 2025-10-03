import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./adminAuthSlice";
import alpha from "./alphaSlice";
import lighting from "./lightingSlice";
import medic from "./medicSlice";
import staff from "./staffSlice";
import tools from "./toolsSlice";
import medicStationery from "./medicStationerySlice";
import driver from "./driverSlice";
import medicEquipment from "./medicEquipmentSlice";
import transactions from "./transactionSlice";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    alpha: alpha,
    lighting: lighting,
    medic: medic,
    staff: staff,
    tools: tools,
    medicStationery: medicStationery,
    driver: driver,
    medicEquipment: medicEquipment,
    transactions: transactions

  },
});

// ✅ Export these types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
