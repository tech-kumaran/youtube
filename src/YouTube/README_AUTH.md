# User Authentication & Location-Based Video Fetching

## Overview

This implementation adds user authentication and location-based video fetching to your YouTube clone. Videos are now personalized based on the user's geographic location, and you can store user credentials for authenticated API requests.

---

## Features

✅ **User Authentication**
- Store user email and authentication token in localStorage
- Support for Chrome storage API (for extensions)
- Automatic session persistence across page refreshes
- Login/logout functionality with Redux state management

✅ **Location Detection**
- Automatic region detection using browser geolocation
- IP-based fallback for region detection
- Region caching for improved performance
- Support for 30+ YouTube regions worldwide

✅ **Location-Based Videos**
- Fetch popular videos for user's region
- Region-specific search results
- Localized recommendations and related videos
- Explore page with regional content

---

## Quick Start

### 1. Initialize Authentication on App Load

Add this to your `App.js` or main component:

```javascript
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuthAction } from './YouTube/actions/authActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user from storage and detect location
    dispatch(initializeAuthAction());
  }, [dispatch]);

  return (
    // Your app content
  );
}
```

### 2. Login a User

```javascript
import { loginUserAction } from './YouTube/actions/authActions';

const handleLogin = () => {
  const email = 'user@example.com';
  const token = 'your-api-token'; // Or OAuth access token
  
  dispatch(loginUserAction(email, token));
};
```

### 3. Fetch User-Specific Videos

```javascript
import { getUserVideosAction } from './YouTube/actions/youTubeActions';

// Fetch videos based on user's region
dispatch(getUserVideosAction);
```

---

## API Reference

### Authentication Actions

#### `loginUserAction(email, token)`
Logs in a user with email and token.

**Parameters:**
- `email` (string): User's email address
- `token` (string): Authentication token (API key or OAuth token)

**Example:**
```javascript
dispatch(loginUserAction('user@example.com', 'token123'));
```

#### `logoutUserAction()`
Logs out the current user and clears credentials.

**Example:**
```javascript
dispatch(logoutUserAction());
```

#### `initializeAuthAction()`
Initializes authentication from storage and detects user's location.

**Example:**
```javascript
dispatch(initializeAuthAction());
```

---

### Location Actions

#### `initializeUserLocationAction()`
Detects user's region and updates Redux state.

**Returns:** Region code (e.g., 'US', 'IN', 'GB')

**Example:**
```javascript
const region = await dispatch(initializeUserLocationAction());
console.log('Detected region:', region);
```

---

### Video Actions (Updated)

All video fetching actions now automatically use the user's region:

#### `getUserVideosAction()`
Fetches personalized videos for the authenticated user.

**Example:**
```javascript
dispatch(getUserVideosAction);
```

#### `getExploreVideosAction(category)`
Fetches videos by category for user's region.

**Parameters:**
- `category` (string): Category name (e.g., 'Music', 'Gaming', 'Trending')

**Example:**
```javascript
dispatch(getExploreVideosAction('Gaming'));
```

#### `getRelatedVideosAction(videoId, title)`
Fetches related videos using user's region for better recommendations.

---

### Utility Functions

#### `getUserEmail()`
Returns the current user's email from storage.

```javascript
import { getUserEmail } from './YouTube/utils/authUtils';
const email = getUserEmail(); // Returns: 'user@example.com' or null
```

#### `getAuthToken()`
Returns the current authentication token.

```javascript
import { getAuthToken } from './YouTube/utils/authUtils';
const token = getAuthToken(); // Returns: 'token123' or null
```

#### `isAuthenticated()`
Checks if user is authenticated.

```javascript
import { isAuthenticated } from './YouTube/utils/authUtils';
if (isAuthenticated()) {
  console.log('User is logged in');
}
```

#### `getUserRegion()`
Gets the user's region (from cache or detects it).

```javascript
import { getUserRegion } from './YouTube/utils/locationUtils';
const region = await getUserRegion(); // Returns: 'US', 'IN', etc.
```

---

## Redux State Structure

### Auth State

```javascript
{
  authState: {
    user: { email: 'user@example.com', token: 'token123' },
    isAuthenticated: true,
    loading: false,
    error: null,
    userRegion: 'US'
  }
}
```

### Accessing Auth State

```javascript
import { useSelector } from 'react-redux';

const { user, isAuthenticated, userRegion } = useSelector(
  (state) => state.authState
);
```

---

## Chrome Storage Support

If you're building a Chrome extension, the utilities automatically use Chrome storage:

```javascript
import { 
  getUserFromChromeStorage,
  saveUserToChromeStorage 
} from './YouTube/utils/authUtils';

// Load from Chrome storage
const user = await getUserFromChromeStorage();

// Save to Chrome storage
await saveUserToChromeStorage({ email, token });
```

---

## Supported Regions

The location utilities support these YouTube regions:

🌎 **Americas:** US, CA, BR, MX, AR, CO  
🌍 **Europe:** GB, FR, DE, IT, ES, NL, SE, RU, PL, TR  
🌏 **Asia:** IN, JP, KR, CN, ID, TH, PH, PK, BD, VN  
🌍 **Africa/Middle East:** NG, ZA, EG  
🌏 **Oceania:** AU

---

## Example Implementation

See [`src/YouTube/examples/UsageExamples.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/examples/UsageExamples.js) for complete working examples.

---

## Troubleshooting

### Videos not showing my region
- Check browser console for region detection logs
- Ensure geolocation permission is granted
- Manually call `initializeUserLocationAction()`

### Authentication not persisting
- Check localStorage in DevTools → Application tab
- Ensure `initializeAuthAction()` is called on app load
- Verify browser allows localStorage

### Chrome storage not working
- Ensure extension has `storage` permission in manifest
- Check `chrome.storage` is available in DevTools console
- Verify the extension context is active

---

## Next Steps

- **OAuth Integration:** Implement full Google OAuth 2.0 flow for real YouTube authentication
- **Token Refresh:** Add automatic token refresh logic
- **User Preferences:** Store additional user preferences (theme, language, etc.)
- **Analytics:** Track which regions use your app most

---

## Files Created

- [`authUtils.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/utils/authUtils.js) - Authentication utilities
- [`locationUtils.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/utils/locationUtils.js) - Location detection utilities
- [`authSlice.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/Slices/authSlice.js) - Authentication Redux slice
- [`authActions.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/actions/authActions.js) - Authentication action creators
- [`youTubeActions.js`](file:///home/kumaran/Downloads/YouTube-clone-main/src/YouTube/actions/youTubeActions.js) - Updated with location support
