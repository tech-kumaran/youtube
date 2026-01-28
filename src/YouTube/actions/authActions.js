/**
 * Authentication Actions
 * Handles user login, logout, and authentication flows
 */

import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutUser,
  initializeAuth,
} from "../Slices/authSlice";
import {
  initializeUserLocationAction,
  initializeHistoryAction,
  fetchRecommendationsAction
} from "./youTubeActions";

/**
 * Login action - saves user credentials
 * @param {string} email - User's email address
 * @param {string} token - Authentication token (API key or OAuth token)
 */
export const loginUserAction = (email, token) => async (dispatch) => {
  try {
    dispatch(loginStart());

    // Validate inputs
    if (!email || !token) {
      throw new Error("Email and token are required");
    }

    // Dispatch login success (this will save to localStorage)
    dispatch(loginSuccess({ email, token }));

    // Initialize user's location after login
    await dispatch(initializeUserLocationAction());

    return { success: true };
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

/**
 * Logout action - clears user credentials
 */
export const logoutUserAction = () => (dispatch) => {
  dispatch(logoutUser());
  console.log("User logged out successfully");
};

/**
 * Initialize authentication on app load
 * Loads user from storage if exists
 */
export const initializeAuthAction = () => async (dispatch) => {
  try {
    // Load user from storage
    dispatch(initializeAuth());

    // Initialize watch history from local storage
    dispatch(initializeHistoryAction());

    // Initialize location detection
    await dispatch(initializeUserLocationAction());

    // Initial fetch of recommendations
    dispatch(fetchRecommendationsAction());

    return { success: true };
  } catch (error) {
    console.error("Error initializing auth:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Example: Login with Google OAuth
 * This is a placeholder for OAuth integration
 */
export const loginWithGoogleAction = () => async (dispatch) => {
  try {
    dispatch(loginStart());

    // In a real implementation, this would:
    // 1. Open Google OAuth consent screen
    // 2. Get authorization code
    // 3. Exchange code for access token
    // 4. Save token and user email

    // For now, this is a placeholder
    console.log("Google OAuth not implemented yet");
    throw new Error("Google OAuth not implemented");
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};
