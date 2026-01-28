/**
 * Recommendation Engine
 * YouTube-style recommendation algorithm for personalized video suggestions
 */

import { 
  getWatchHistory, 
  getTopCategories, 
  getHistoryKeywords,
  getTopChannels 
} from './watchHistoryUtils';

/**
 * Calculates recommendation score for a video
 * @param {Object} video - Video to score
 * @param {Object} context - User context (history, preferences, region)
 * @returns {number} Score between 0-100
 */
export const calculateRecommendationScore = (video, context) => {
  const {
    watchHistory = [],
    topCategories = [],
    userRegion = 'US',
    currentVideo = null,
    historyKeywords = [],
  } = context;

  let score = 0;

  // 1. History Match (40%)
  const historyScore = calculateHistoryMatch(video, watchHistory, historyKeywords);
  score += historyScore * 0.40;

  // 2. Category Preference (25%)
  const categoryScore = calculateCategoryScore(video, topCategories);
  score += categoryScore * 0.25;

  // 3. Trending Score (20%)
  const trendingScore = calculateTrendingScore(video);
  score += trendingScore * 0.20;

  // 4. Location Relevance (10%)
  const locationScore = calculateLocationScore(video, userRegion);
  score += locationScore * 0.10;

  // 5. Recency Boost (5%)
  const recencyScore = calculateRecencyScore(video);
  score += recencyScore * 0.05;

  // Current video similarity boost
  if (currentVideo) {
    const similarityBonus = calculateSimilarity(video, currentVideo) * 10;
    score += similarityBonus;
  }

  return Math.min(100, Math.max(0, score));
};

/**
 * Calculates how well video matches watch history
 * @param {Object} video - Video to score
 * @param {Array} watchHistory - User's watch history
 * @param {Array} historyKeywords - Keywords from history
 * @returns {number} Score 0-100
 */
const calculateHistoryMatch = (video, watchHistory, historyKeywords) => {
  if (watchHistory.length === 0) return 50; // Neutral score if no history

  let score = 0;
  const videoKeywords = extractKeywords(video);

  // Check if video is from a frequently watched channel
  const channelMatches = watchHistory.filter(
    h => h.channelId === video.snippet?.channelId
  ).length;
  score += Math.min(40, channelMatches * 10);

  // Check keyword overlap with history
  const keywordMatches = videoKeywords.filter(keyword =>
    historyKeywords.some(hk => hk.tag === keyword.toLowerCase())
  ).length;
  score += Math.min(40, keywordMatches * 8);

  // Category match from history
  const categoryMatches = watchHistory.filter(
    h => h.categoryId === video.snippet?.categoryId
  ).length;
  score += Math.min(20, categoryMatches * 5);

  return Math.min(100, score);
};

/**
 * Calculates category preference score
 * @param {Object} video - Video to score
 * @param {Array} topCategories - User's top categories
 * @returns {number} Score 0-100
 */
const calculateCategoryScore = (video, topCategories) => {
  if (topCategories.length === 0) return 50;

  const videoCategoryId = video.snippet?.categoryId;
  const categoryIndex = topCategories.findIndex(
    cat => cat.categoryId === videoCategoryId
  );

  if (categoryIndex === -1) return 30; // Not in top categories

  // Higher score for top categories
  return 100 - (categoryIndex * 15);
};

/**
 * Calculates trending/popularity score
 * @param {Object} video - Video to score
 * @returns {number} Score 0-100
 */
const calculateTrendingScore = (video) => {
  const stats = video.statistics;
  if (!stats) return 50;

  const viewCount = parseInt(stats.viewCount || 0);
  const likeCount = parseInt(stats.likeCount || 0);
  const commentCount = parseInt(stats.commentCount || 0);

  // Normalize view count (assume max 10M views = 100 score)
  const viewScore = Math.min(100, (viewCount / 10000000) * 100);

  // Engagement rate (likes + comments relative to views)
  const engagementRate = viewCount > 0
    ? ((likeCount + commentCount) / viewCount) * 1000
    : 0;
  const engagementScore = Math.min(100, engagementRate * 20);

  // Combine 70% views, 30% engagement
  return (viewScore * 0.7) + (engagementScore * 0.3);
};

/**
 * Calculates location relevance score
 * @param {Object} video - Video to score
 * @param {string} userRegion - User's region code
 * @returns {number} Score 0-100
 */
const calculateLocationScore = (video, userRegion) => {
  // Check if video defaultLanguage or defaultAudioLanguage matches region
  const snippet = video.snippet || {};
  const defaultLanguage = snippet.defaultLanguage || '';
  const defaultAudioLanguage = snippet.defaultAudioLanguage || '';

  // Region language mapping
  const regionLanguages = {
    'US': 'en',
    'GB': 'en',
    'IN': ['en', 'hi'],
    'JP': 'ja',
    'KR': 'ko',
    'BR': 'pt',
    'FR': 'fr',
    'DE': 'de',
    'ES': 'es',
    'MX': 'es',
  };

  const expectedLanguages = regionLanguages[userRegion] || [];
  const languages = Array.isArray(expectedLanguages) 
    ? expectedLanguages 
    : [expectedLanguages];

  // Check language match
  if (languages.some(lang => 
    defaultLanguage.startsWith(lang) || defaultAudioLanguage.startsWith(lang)
  )) {
    return 100;
  }

  return 60; // Neutral score if no language info
};

/**
 * Calculates recency score (newer = higher)
 * @param {Object} video - Video to score
 * @returns {number} Score 0-100
 */
const calculateRecencyScore = (video) => {
  const publishedAt = video.snippet?.publishedAt;
  if (!publishedAt) return 50;

  const publishDate = new Date(publishedAt);
  const now = new Date();
  const daysSincePublish = (now - publishDate) / (1000 * 60 * 60 * 24);

  // Videos less than 1 day old get max score
  if (daysSincePublish < 1) return 100;
  // Videos less than 7 days old get high score
  if (daysSincePublish < 7) return 80;
  // Videos less than 30 days old get medium score
  if (daysSincePublish < 30) return 60;
  // Older videos get lower score
  return Math.max(20, 100 - daysSincePublish);
};

/**
 * Extracts keywords from video title and description
 * @param {Object} video - Video object
 * @returns {Array} Array of keywords
 */
export const extractKeywords = (video) => {
  const snippet = video.snippet || {};
  const title = snippet.title || '';
  const description = snippet.description || '';
  const tags = snippet.tags || [];

  // Combine text
  const text = `${title} ${description}`.toLowerCase();

  // Common stop words to ignore
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
  ];

  // Extract words (3+ characters)
  const words = text
    .match(/\b\w{3,}\b/g) || []
    .filter(word => !stopWords.includes(word));

  // Include tags
  const allKeywords = [...new Set([...words, ...tags.map(t => t.toLowerCase())])];

  return allKeywords.slice(0, 30); // Limit to 30 keywords
};

/**
 * Calculates similarity between two videos
 * @param {Object} video1 - First video
 * @param {Object} video2 - Second video
 * @returns {number} Similarity score 0-1
 */
export const calculateSimilarity = (video1, video2) => {
  const keywords1 = extractKeywords(video1);
  const keywords2 = extractKeywords(video2);

  // Calculate Jaccard similarity
  const intersection = keywords1.filter(k => keywords2.includes(k)).length;
  const union = new Set([...keywords1, ...keywords2]).size;

  const keywordSimilarity = union > 0 ? intersection / union : 0;

  // Category match
  const categoryMatch = video1.snippet?.categoryId === video2.snippet?.categoryId ? 1 : 0;

  // Channel match
  const channelMatch = video1.snippet?.channelId === video2.snippet?.channelId ? 1 : 0;

  // Weighted combination
  return (keywordSimilarity * 0.6) + (categoryMatch * 0.3) + (channelMatch * 0.1);
};

/**
 * Gets user context from watch history
 * @returns {Object} User context for recommendations
 */
export const getContextFromHistory = () => {
  const watchHistory = getWatchHistory();
  const topCategories = getTopCategories(5);
  const historyKeywords = getHistoryKeywords();
  const topChannels = getTopChannels(5);

  return {
    watchHistory,
    topCategories,
    historyKeywords,
    topChannels,
  };
};

/**
 * Gets personalized recommendations from video list
 * @param {Array} videos - Videos to rank
 * @param {Object} context - User context
 * @returns {Array} Sorted videos with scores
 */
export const getPersonalizedRecommendations = (videos, context) => {
  // Score all videos
  const scoredVideos = videos.map(video => ({
    ...video,
    recommendationScore: calculateRecommendationScore(video, context),
  }));

  // Sort by score
  scoredVideos.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return scoredVideos;
};

/**
 * Mixes trending videos with personalized recommendations
 * @param {Array} trending - Trending videos
 * @param {Array} personalized - Personalized videos
 * @param {number} trendingRatio - Ratio of trending (0-1, default 0.3)
 * @returns {Array} Mixed video feed
 */
export const mixTrendingWithPersonalized = (trending, personalized, trendingRatio = 0.3) => {
  const trendingCount = Math.floor(trending.length * trendingRatio);
  const personalizedCount = personalized.length - trendingCount;

  const result = [];
  let tIndex = 0;
  let pIndex = 0;

  // Interleave trending and personalized
  while (result.length < personalized.length && (tIndex < trendingCount || pIndex < personalizedCount)) {
    // Add personalized
    if (pIndex < personalizedCount && personalized[pIndex]) {
      result.push(personalized[pIndex]);
      pIndex++;
    }

    // Add personalized again (2:1 ratio)
    if (pIndex < personalizedCount && personalized[pIndex]) {
      result.push(personalized[pIndex]);
      pIndex++;
    }

    // Add trending
    if (tIndex < trendingCount && trending[tIndex]) {
      result.push(trending[tIndex]);
      tIndex++;
    }
  }

  return result;
};

/**
 * Filters out already watched videos
 * @param {Array} videos - Videos to filter
 * @param {Array} watchHistory - Watch history
 * @returns {Array} Filtered videos
 */
export const filterWatchedVideos = (videos, watchHistory) => {
  const watchedIds = new Set(watchHistory.map(h => h.videoId));
  return videos.filter(video => !watchedIds.has(video.id));
};
