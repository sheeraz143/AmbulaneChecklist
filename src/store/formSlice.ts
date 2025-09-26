import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  staffId: string;
  formData: Record<string, any>;
}

const initialState: FormState = {
  staffId: "",
  formData: {},
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setStaffId(state, action: PayloadAction<string>) {
      state.staffId = action.payload;
    },
    updateForm(state, action: PayloadAction<Record<string, any>>) {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm(state) {
      state.staffId = "";
      state.formData = {};
    },
  },
});

export const { setStaffId, updateForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
