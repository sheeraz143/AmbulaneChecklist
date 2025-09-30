import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store"; // adjust if your store file name is different

// ✅ Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ✅ Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
