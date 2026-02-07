import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice.js";
import uiReducer from "./slices/uislice.js";
const store= configureStore({
    reducer:{
        auth: authReducer,
        ui:uiReducer,
    },
});
export default store;