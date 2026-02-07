// file to keep all the responses
import { createSlice } from "@reduxjs/toolkit";


const initialState={
  user: null,
  token: localStorage.getItem("token")||null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
   authMode: null, 
};
//functionality on these

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers: {
    //to make loading state true during api calls
    setLoading: (state,action) =>{
        state.isLoading=action.payload;
        state.error=null;
    },
    //set user after sucessful login/reg/fetchuser
    // stores token in local storage for persistance
    setUser: (state,action) => {
        state.user = action.payload.user;
        state.token=action.payload.token;
        state.isAuthenticated=true;
        state.isLoading=false;
        state.error=null;

        if(action.payload.token)
             localStorage.setItem("token",action.payload.token);

    },
    //to not crash website
    setError : (state,action)=>{
        state.error = action.payload;
        state.isLoading=false;
        //state.token = null;
        //state.isAuthenticated = false;
    },
    logout : (state)=>{
        state.user=null;//no info with browser
        state.token=null;
        state.isAuthenticated=false;
        state.error=null;
        localStorage.removeItem("token");
    },
    updateFavourite: (state,action) => {
        if(state.user){
            state.user.favourites=action.payload;
        }
    },
    clearError :(state)=>{
        state.error=null;
    },
openAuthModal: (state, action) => {
    state.authMode = action.payload;
    state.error = null;
  },

  closeAuthModal: (state) => {
    state.authMode = null;
    state.error = null;
  },

  },

});
export const {
   setLoading,
   setUser,
   setError,
   logout,
   clearError,
   updateFavourite,
   openAuthModal,
   closeAuthModal,


}=authSlice.actions;

export default authSlice.reducer;