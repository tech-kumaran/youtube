/**
 * Filter helper utilities for YouTube data filtering
 */

/**
 * Calculate the publishedAfter date based on upload date filter
 * @param {string} uploadDate - Filter value: 'any', 'hour', 'today', 'week', 'month', 'year'
 * @returns {string|null} ISO date string or null if 'any'
 */
export const getPublishedAfterDate = (uploadDate) => {
  if (uploadDate === 'any') return null;

  const now = new Date();
  let date = new Date(now);

  switch (uploadDate) {
    case 'hour':
      date.setHours(now.getHours() - 1);
      break;
    case 'today':
      date.setHours(0, 0, 0, 0);
      break;
    case 'week':
      date.setDate(now.getDate() - 7);
      break;
    case 'month':
      date.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      date.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return null;
  }

  return date.toISOString();
};

/**
 * Get formatted label for filter display
 * @param {string} filterType - Type of filter: 'duration' or 'uploadDate'
 * @param {string} value - Filter value
 * @returns {string} Formatted label
 */
export const formatFilterLabel = (filterType, value) => {
  if (filterType === 'duration') {
    const durationLabels = {
      any: 'Any Duration',
      short: 'Under 4 minutes',
      medium: '4 - 20 minutes',
      long: 'Over 20 minutes',
    };
    return durationLabels[value] || 'Any Duration';
  }

  if (filterType === 'uploadDate') {
    const dateLabels = {
      any: 'Any Time',
      hour: 'Last Hour',
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      year: 'This Year',
    };
    return dateLabels[value] || 'Any Time';
  }

  return value;
};

/**
 * Check if any filters are active (non-default)
 * @param {object} state - YouTube state object
 * @returns {boolean} True if filters are active
 */
export const hasActiveFilters = (state) => {
  return (
    state.videoDuration !== 'any' ||
    state.uploadDate !== 'any' ||
    (state.searchQuery && state.searchQuery !== '' && state.searchQuery !== 'All') ||
    state.order !== 'relevance'
  );
};

/**
 * Get API-compatible video duration parameter
 * @param {string} duration - Filter value: 'any', 'short', 'medium', 'long'
 * @returns {string|null} API parameter or null if 'any'
 */
export const getVideoDurationParam = (duration) => {
  if (duration === 'any') return null;
  return duration;
};
