/**
 * Watch History Utilities
 * Tracks user viewing behavior in localStorage for personalized recommendations
 */

const WATCH_HISTORY_KEY = 'youtube_watch_history';
const SEARCH_HISTORY_KEY = 'youtube_search_history';
const MAX_HISTORY_SIZE = 100;
const MAX_SEARCH_HISTORY = 50;

/**
 * Adds a video to watch history
 * @param {Object} video - Video object from YouTube API
 * @param {number} watchTime - Seconds watched (optional)
 */
export const addToWatchHistory = (video, watchTime = 0) => {
  try {
    const history = getWatchHistory();
    
    const historyEntry = {
      videoId: video.id,
      title: video.snippet?.title || 'Untitled',
      categoryId: video.snippet?.categoryId || 'Unknown',
      channelId: video.snippet?.channelId || '',
      channelTitle: video.snippet?.channelTitle || '',
      thumbnail: video.snippet?.thumbnails?.default?.url || '',
      timestamp: new Date().toISOString(),
      watchTime: watchTime,
      duration: video.contentDetails?.duration || '',
      tags: video.snippet?.tags || [],
    };
    
    // Remove if already exists (update to latest watch)
    const filtered = history.filter(item => item.videoId !== video.id);
    
    // Add to beginning of array
    const updated = [historyEntry, ...filtered];
    
    // Limit history size
    const limited = updated.slice(0, MAX_HISTORY_SIZE);
    
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    return false;
  }
};

/**
 * Gets full watch history
 * @returns {Array} Watch history entries
 */
export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(WATCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading watch history:', error);
    return [];
  }
};

/**
 * Gets recently watched videos
 * @param {number} limit - Number of recent videos to return
 * @returns {Array} Recent watch history
 */
export const getRecentlyWatched = (limit = 10) => {
  const history = getWatchHistory();
  return history.slice(0, limit);
};

/**
 * Adds a search query to history
 * @param {string} query - Search query text
 */
export const addSearchQuery = (query) => {
  try {
    if (!query || query.trim() === '') return false;
    
    const searches = getSearchHistory();
    
    const searchEntry = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
    };
    
    // Remove if already exists
    const filtered = searches.filter(item => item.query !== query.trim());
    
    // Add to beginning
    const updated = [searchEntry, ...filtered];
    
    // Limit size
    const limited = updated.slice(0, MAX_SEARCH_HISTORY);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Error adding search query:', error);
    return false;
  }
};

/**
 * Gets search history
 * @returns {Array} Search history entries
 */
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
};

/**
 * Gets recent searches
 * @param {number} limit - Number of searches to return
 * @returns {Array} Recent searches
 */
export const getRecentSearches = (limit = 10) => {
  const searches = getSearchHistory();
  return searches.slice(0, limit).map(s => s.query);
};

/**
 * Clears all watch history
 */
export const clearWatchHistory = () => {
  try {
    localStorage.removeItem(WATCH_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing watch history:', error);
    return false;
  }
};

/**
 * Clears all search history
 */
export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing search history:', error);
    return false;
  }
};

/**
 * Clears all history (watch + search)
 */
export const clearAllHistory = () => {
  clearWatchHistory();
  clearSearchHistory();
};

/**
 * Analyzes watch history to get top categories
 * @param {number} limit - Number of top categories to return
 * @returns {Array} Top category IDs with counts
 */
export const getTopCategories = (limit = 5) => {
  const history = getWatchHistory();
  
  // Count occurrences of each category
  const categoryCounts = {};
  history.forEach(entry => {
    const cat = entry.categoryId;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  // Sort by count
  const sorted = Object.entries(categoryCounts)
    .map(([categoryId, count]) => ({ categoryId, count }))
    .sort((a, b) => b.count - a.count);
  
  return sorted.slice(0, limit);
};

/**
 * Gets array of watched video IDs
 * @returns {Array} Video IDs
 */
export const getWatchedVideoIds = () => {
  const history = getWatchHistory();
  return history.map(entry => entry.videoId);
};

/**
 * Checks if a video has been watched
 * @param {string} videoId - Video ID to check
 * @returns {boolean} True if watched
 */
export const hasWatchedVideo = (videoId) => {
  const watchedIds = getWatchedVideoIds();
  return watchedIds.includes(videoId);
};

/**
 * Gets watch time statistics
 * @returns {Object} Statistics object
 */
export const getWatchStats = () => {
  const history = getWatchHistory();
  
  return {
    totalVideos: history.length,
    topCategories: getTopCategories(5),
    recentlyWatched: getRecentlyWatched(5),
    totalWatchTime: history.reduce((sum, entry) => sum + (entry.watchTime || 0), 0),
    averageWatchTime: history.length > 0 
      ? history.reduce((sum, entry) => sum + (entry.watchTime || 0), 0) / history.length 
      : 0,
  };
};

/**
 * Gets channels user watches most
 * @param {number} limit - Number of channels to return
 * @returns {Array} Top channels with counts
 */
export const getTopChannels = (limit = 5) => {
  const history = getWatchHistory();
  
  // Count occurrences
  const channelCounts = {};
  history.forEach(entry => {
    const channelId = entry.channelId;
    if (channelId) {
      if (!channelCounts[channelId]) {
        channelCounts[channelId] = {
          channelId,
          channelTitle: entry.channelTitle,
          count: 0
        };
      }
      channelCounts[channelId].count++;
    }
  });
  
  // Sort by count
  const sorted = Object.values(channelCounts)
    .sort((a, b) => b.count - a.count);
  
  return sorted.slice(0, limit);
};

/**
 * Extracts keywords from watch history
 * @returns {Array} Common keywords from watched videos
 */
export const getHistoryKeywords = () => {
  const history = getWatchHistory();
  
  // Extract all tags
  const allTags = [];
  history.forEach(entry => {
    if (entry.tags && Array.isArray(entry.tags)) {
      allTags.push(...entry.tags);
    }
  });
  
  // Count occurrences
  const tagCounts = {};
  allTags.forEach(tag => {
    const normalized = tag.toLowerCase();
    tagCounts[normalized] = (tagCounts[normalized] || 0) + 1;
  });
  
  // Sort by count
  const sorted = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
  
  return sorted.slice(0, 20);
};
