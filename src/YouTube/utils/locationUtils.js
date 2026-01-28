/**
 * Location Utilities
 * Handles user geolocation and region detection
 */

/**
 * Default region code if detection fails
 */
const DEFAULT_REGION = 'US';

/**
 * Gets user's current geolocation using browser API
 * @returns {Promise<Object>} Coordinates {latitude, longitude} or null if denied
 */
export const getUserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Geolocation permission denied or error:', error.message);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
};

/**
 * Converts coordinates to region code using reverse geocoding
 * Uses a free geocoding API (BigDataCloud)
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} Region code (e.g., 'US', 'IN', 'GB')
 */
export const getRegionFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    const data = await response.json();
    const countryCode = data.countryCode; // ISO 2-letter code
    
    if (countryCode) {
      return countryCode.toUpperCase();
    }
    
    return DEFAULT_REGION;
  } catch (error) {
    console.error('Error fetching region from coordinates:', error);
    return DEFAULT_REGION;
  }
};

/**
 * Gets region code from IP address using ipapi.co
 * @returns {Promise<string>} Region code
 */
export const getRegionFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code) {
      return data.country_code.toUpperCase();
    }
    
    return DEFAULT_REGION;
  } catch (error) {
    console.error('Error fetching region from IP:', error);
    return DEFAULT_REGION;
  }
};

/**
 * Detects user's region with multiple fallback methods
 * Priority: Geolocation > IP Detection > Default
 * @returns {Promise<string>} YouTube region code (e.g., 'US', 'IN')
 */
export const detectUserRegion = async () => {
  try {
    // Method 1: Try geolocation first
    const location = await getUserLocation();
    
    if (location) {
      const regionCode = await getRegionFromCoordinates(
        location.latitude,
        location.longitude
      );
      console.log('Region detected from geolocation:', regionCode);
      return regionCode;
    }
    
    // Method 2: Fallback to IP-based detection
    console.log('Geolocation unavailable, detecting region from IP...');
    const ipRegion = await getRegionFromIP();
    console.log('Region detected from IP:', ipRegion);
    return ipRegion;
    
  } catch (error) {
    console.error('Error detecting user region:', error);
    return DEFAULT_REGION;
  }
};

/**
 * Gets region from localStorage if previously saved
 * @returns {string|null} Saved region code or null
 */
export const getSavedRegion = () => {
  try {
    return localStorage.getItem('youtube_user_region');
  } catch (error) {
    console.error('Error reading saved region:', error);
    return null;
  }
};

/**
 * Saves region to localStorage for future sessions
 * @param {string} regionCode - Region code to save
 * @returns {boolean} Success status
 */
export const saveRegion = (regionCode) => {
  try {
    localStorage.setItem('youtube_user_region', regionCode);
    return true;
  } catch (error) {
    console.error('Error saving region:', error);
    return false;
  }
};

/**
 * Gets user region with caching
 * First checks localStorage, then detects if not found
 * @returns {Promise<string>} Region code
 */
export const getUserRegion = async () => {
  const savedRegion = getSavedRegion();
  
  if (savedRegion) {
    console.log('Using saved region:', savedRegion);
    return savedRegion;
  }
  
  const detectedRegion = await detectUserRegion();
  saveRegion(detectedRegion);
  return detectedRegion;
};


