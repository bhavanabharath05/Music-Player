import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  authMode: "login", // login / signup / forgot
  errors: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.authMode = action.payload || "login";
    },
    closeAuthModal: (state, action) => {
      state.authMode = "login";
    },
    switchAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
  },
});
export const {
  openAuthModal,
  closeAuthModal,
  switchAuthMode,
} = authSlice.actions;

export default authSlice.reducer;
