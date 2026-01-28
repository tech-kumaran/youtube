/**
 * Example Usage: Authentication and Location-Based Video Fetching
 * 
 * This file demonstrates how to use the authentication and location features
 * in your React components.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUserAction, 
  logoutUserAction, 
  initializeAuthAction 
} from '../actions/authActions';
import { 
  getUserVideosAction, 
  initializeUserLocationAction 
} from '../actions/youTubeActions';

/**
 * Example 1: Initialize authentication on app load
 * Place this in your main App.js or index.js
 */
function AppInitialization() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth from storage and detect location
    dispatch(initializeAuthAction());
  }, [dispatch]);

  return null;
}

/**
 * Example 2: Login Component
 * Demonstrates how to login a user with email and token
 */
function LoginExample() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state) => state.authState
  );

  const handleLogin = () => {
    // Example: Login with user credentials
    // In a real app, you'd get these from a login form or OAuth flow
    const email = 'user@example.com';
    const token = 'your-youtube-api-token-or-oauth-token';
    
    dispatch(loginUserAction(email, token));
  };

  const handleLogout = () => {
    dispatch(logoutUserAction());
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      ) : (
        <div>
          <p>Logged in as: {user?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

/**
 * Example 3: Display User's Region
 * Shows the detected region and allows manual override
 */
function RegionDisplay() {
  const dispatch = useDispatch();
  const { userRegion } = useSelector((state) => state.authState);
  const { currentRegion } = useSelector((state) => state.youTubeState);

  const handleDetectLocation = () => {
    dispatch(initializeUserLocationAction());
  };

  return (
    <div>
      <p>Your Region: {userRegion || currentRegion || 'Detecting...'}</p>
      <button onClick={handleDetectLocation}>
        Re-detect Location
      </button>
    </div>
  );
}

/**
 * Example 4: Fetch User-Specific Videos
 * Fetches videos based on user's location and authentication
 */
function UserVideos() {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.youTubeState);
  const { isAuthenticated, userRegion } = useSelector((state) => state.authState);

  const fetchUserVideos = () => {
    dispatch(getUserVideosAction);
  };

  useEffect(() => {
    // Fetch videos when region is detected
    if (userRegion) {
      fetchUserVideos();
    }
  }, [userRegion]);

  return (
    <div>
      <h2>Videos for your region ({userRegion})</h2>
      {isAuthenticated && <p>Showing personalized content</p>}
      
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div>
          {videos.items && videos.items.map((video) => (
            <div key={video.id}>
              <h3>{video.snippet.title}</h3>
              {/* Add video content here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Retrieve User Data from Storage
 * Directly access user credentials when needed
 */
import { getUserEmail, getAuthToken, isAuthenticated } from '../utils/authUtils';

function DirectStorageAccess() {
  const email = getUserEmail();
  const token = getAuthToken();
  const authenticated = isAuthenticated();

  console.log('User Email:', email);
  console.log('Auth Token:', token);
  console.log('Is Authenticated:', authenticated);

  return (
    <div>
      {authenticated ? (
        <p>Authenticated as: {email}</p>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
}

/**
 * Example 6: Manual Login with Data from Chrome Storage
 * If you're storing credentials in Chrome (e.g., from an extension)
 */
import { getUserFromChromeStorage } from '../utils/authUtils';

async function loadUserFromChrome() {
  const user = await getUserFromChromeStorage();
  
  if (user && user.email && user.token) {
    console.log('User loaded from Chrome:', user.email);
    // Dispatch login action
    // dispatch(loginUserAction(user.email, user.token));
  } else {
    console.log('No user found in Chrome storage');
  }
}

/**
 * Example 7: Complete Integration in App.js
 */
function CompleteExample() {
  const dispatch = useDispatch();
  const { isAuthenticated, userRegion } = useSelector((state) => state.authState);

  useEffect(() => {
    // Step 1: Initialize authentication from storage
    const initializeApp = async () => {
      // Load user from storage and detect location
      await dispatch(initializeAuthAction());
      
      // Alternatively, load from Chrome storage
      const chromeUser = await getUserFromChromeStorage();
      if (chromeUser && !isAuthenticated) {
        dispatch(loginUserAction(chromeUser.email, chromeUser.token));
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    // Step 2: Fetch videos once region is detected
    if (userRegion) {
      console.log('Region detected:', userRegion);
      dispatch(getUserVideosAction);
    }
  }, [userRegion, dispatch]);

  return (
    <div>
      <h1>YouTube Clone</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome! Showing personalized content for {userRegion}</p>
          <UserVideos />
        </div>
      ) : (
        <div>
          <p>Browse as guest (Region: {userRegion})</p>
          <LoginExample />
        </div>
      )}
    </div>
  );
}

export {
  AppInitialization,
  LoginExample,
  RegionDisplay,
  UserVideos,
  DirectStorageAccess,
  CompleteExample,
};
