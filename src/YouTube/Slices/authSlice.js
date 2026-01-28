import { createSlice } from "@reduxjs/toolkit";
import { 
  getUserFromStorage, 
  saveUserToStorage, 
  removeUserFromStorage
} from "../utils/authUtils";

const initialState = {
  user: null, // { email, token }
  isAuthenticated: false,
  loading: false,
  error: null,
  userRegion: null, // User's detected region code
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Initialize authentication from storage
    initializeAuth(state) {
      const user = getUserFromStorage();
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },

    // Start login process
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    // Login success
    loginSuccess(state, action) {
      const { email, token } = action.payload;
      
      const user = { email, token };
      saveUserToStorage(user);
      
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Login failure
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout user
    logoutUser(state) {
      removeUserFromStorage();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userRegion = null;
    },

    // Update user token (for token refresh scenarios)
    updateToken(state, action) {
      if (state.user) {
        state.user.token = action.payload;
        saveUserToStorage(state.user);
      }
    },

    // Set user region
    setUserRegion(state, action) {
      state.userRegion = action.payload;
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  updateToken,
  setUserRegion,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
