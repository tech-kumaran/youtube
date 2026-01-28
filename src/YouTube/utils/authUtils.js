/**
 * Authentication Utilities
 * Manages user credentials in browser storage (localStorage)
 */

const USER_STORAGE_KEY = 'youtube_user';

/**
 * Retrieves user credentials from localStorage
 * @returns {Object|null} User object with email and token, or null if not found
 */
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    // Validate that user has required fields
    if (user && user.email && user.token) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error reading user from storage:', error);
    return null;
  }
};

/**
 * Saves user credentials to localStorage
 * @param {Object} user - User object containing email and token
 * @param {string} user.email - User's email address
 * @param {string} user.token - Authentication token
 * @returns {boolean} Success status
 */
export const saveUserToStorage = (user) => {
  try {
    if (!user || !user.email || !user.token) {
      console.error('Invalid user object. Must contain email and token.');
      return false;
    }
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving user to storage:', error);
    return false;
  }
};

/**
 * Removes user credentials from localStorage
 * @returns {boolean} Success status
 */
export const removeUserFromStorage = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user from storage:', error);
    return false;
  }
};

/**
 * Gets the current authentication token
 * @returns {string|null} Auth token or null if not authenticated
 */
export const getAuthToken = () => {
  const user = getUserFromStorage();
  return user ? user.token : null;
};

/**
 * Gets the current user's email
 * @returns {string|null} User email or null if not authenticated
 */
export const getUserEmail = () => {
  const user = getUserFromStorage();
  return user ? user.email : null;
};

/**
 * Checks if user is authenticated
 * @returns {boolean} True if user has valid credentials
 */
export const isAuthenticated = () => {
  const user = getUserFromStorage();
  return user !== null && user.email && user.token;
};

/**
 * Updates user token (refresh token scenario)
 * @param {string} newToken - New authentication token
 * @returns {boolean} Success status
 */
export const updateAuthToken = (newToken) => {
  try {
    const user = getUserFromStorage();
    if (!user) {
      console.error('No user found to update token');
      return false;
    }
    
    user.token = newToken;
    return saveUserToStorage(user);
  } catch (error) {
    console.error('Error updating auth token:', error);
    return false;
  }
};

/**
 * Gets user data from Chrome storage (for Chrome extensions)
 * Note: This requires chrome.storage API and appropriate permissions
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserFromChromeStorage = async () => {
  try {
    // Check if chrome.storage is available
    /* eslint-disable no-undef */
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.get([USER_STORAGE_KEY], (result) => {
          const user = result[USER_STORAGE_KEY];
          resolve(user || null);
        });
      });
    /* eslint-enable no-undef */
    } else {
      console.warn('Chrome storage not available, falling back to localStorage');
      return getUserFromStorage();
    }
  } catch (error) {
    console.error('Error reading from Chrome storage:', error);
    return getUserFromStorage(); // Fallback to localStorage
  }
};

/**
 * Saves user data to Chrome storage (for Chrome extensions)
 * @param {Object} user - User object
 * @returns {Promise<boolean>} Success status
 */
export const saveUserToChromeStorage = async (user) => {
  try {
    /* eslint-disable no-undef */
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.set({ [USER_STORAGE_KEY]: user }, () => {
          resolve(true);
        });
      });
    /* eslint-enable no-undef */
    } else {
      console.warn('Chrome storage not available, using localStorage');
      return saveUserToStorage(user);
    }
  } catch (error) {
    console.error('Error saving to Chrome storage:', error);
    return saveUserToStorage(user); // Fallback to localStorage
  }
};
