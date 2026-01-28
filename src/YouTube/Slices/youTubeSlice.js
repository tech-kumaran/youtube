import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isFetchingMore: false,
  videos: { items: [] },
  nextPageToken: null,
  videoCategories: [],
  searchQuery: "",
  selectedCategory: "all",
  order: "relevance",
  currentRegion: "IN",
  randomCategory: null,
  currentVideoDetails: null,
  videoComments: [],
  relatedVideos: { items: [] },
  isFetchingRelated: false,
  channelDetails: null,
  playlists: [],
  playlistItems: [],
  subscriptions: [],
  captions: [],
  activities: [],
  i18nLanguages: [],
  i18nRegions: [],
  shorts: { items: [] },
  exploreVideos: { items: [] },
  isFetchingExplore: false,
  // Recommendation system
  recommendedVideos: { items: [] },
  recommendedNextPageToken: null,
  isRecommendationsActive: false,
  recommendationLoading: false,
  isFetchingMoreRecommendations: false,
  trendingVideos: { items: [] },
  watchHistory: [],
  userPreferences: {
    topCategories: [],
    recentSearches: [],
  },
  isDarkMode: localStorage.getItem("isDarkMode") !== null 
    ? JSON.parse(localStorage.getItem("isDarkMode")) 
    : true, // Default to Dark Mode
};

const YouTubeSlice = createSlice({
  name: "getYouTubeVideos",
  initialState,
  reducers: {
    getYouTubeVideos(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    getYouTubeVideosMore(state, action) {
      return {
        ...state,
        isFetchingMore: true,
      };
    },
    getYouTubeVideosSuccess(state, action) {
      const isPagination = action.payload.isPagination;
      const newVideos = action.payload.data.items;
      
      return {
        ...state,
        loading: false,
        isFetchingMore: false,
        videos: {
          ...action.payload.data,
          items: isPagination 
            ? [...state.videos.items, ...newVideos]
            : newVideos
        },
        nextPageToken: action.payload.data.nextPageToken || null,
      };
    },
    getYouTubeVideosFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    getYouTubeChannelsSuccess(state, action) {
      return {
        ...state,
        channelDetails: action.payload.data,
      };
    },
    getYouTubeCategoriesSuccess(state, action) {
      return {
        ...state,
        videoCategories: action.payload.data.items,
      };
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      // Disable recommendations if searching, enable if search cleared and "All" category
      state.isRecommendationsActive = (action.payload === "" && state.selectedCategory === "all");
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
      // Enable recommendations only if "all" is selected and no search query active
      state.isRecommendationsActive = (action.payload === "all" && state.searchQuery === "");
    },
    setCurrentRegion(state, action) {
      return {
        ...state,
        currentRegion: action.payload,
      };
    },
    setRandomCategory(state, action) {
      return {
        ...state,
        randomCategory: action.payload,
      };
    },
    getVideoDetailsSuccess(state, action) {
      return {
        ...state,
        currentVideoDetails: action.payload.data.items[0],
      };
    },
    getVideoCommentsSuccess(state, action) {
      return {
        ...state,
        videoComments: action.payload.data.items,
      };
    },
    getRelatedVideos(state) {
      return {
        ...state,
        isFetchingRelated: true,
      };
    },
    getRelatedVideosSuccess(state, action) {
      return {
        ...state,
        isFetchingRelated: false,
        relatedVideos: action.payload.data,
      };
    },
    getPlaylistsSuccess(state, action) {
      state.playlists = action.payload.data.items;
    },
    getPlaylistItemsSuccess(state, action) {
      state.playlistItems = action.payload.data.items;
    },
    getSubscriptionsSuccess(state, action) {
      state.subscriptions = action.payload.data.items;
    },
    getCaptionsSuccess(state, action) {
      state.captions = action.payload.data.items;
    },
    getActivitiesSuccess(state, action) {
      state.activities = action.payload.data.items;
    },
    getI18nLanguagesSuccess(state, action) {
      state.i18nLanguages = action.payload.data.items;
    },
    getI18nRegionsSuccess(state, action) {
      state.i18nRegions = action.payload.data.items;
    },
    getShortsSuccess(state, action) {
      state.shorts = action.payload.data;
    },
    getExploreVideos(state) {
      state.isFetchingExplore = true;
    },
    getExploreVideosSuccess(state, action) {
      state.isFetchingExplore = false;
      state.exploreVideos = action.payload.data;
    },
    resetFilters(state) {
      return {
        ...state,
        searchQuery: "",
        selectedCategory: "all",
        nextPageToken: null,
        randomCategory: null,
        isRecommendationsActive: true, // Reset should enable recommendations
      };
    },
    toggleTheme(state) {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newDarkMode));
      return {
        ...state,
        isDarkMode: newDarkMode,
      };
    },
    // Recommendation actions
    getRecommendedVideos(state, action) {
      if (action.payload?.isPagination) {
        state.isFetchingMoreRecommendations = true;
      } else {
        state.recommendationLoading = true;
        state.isRecommendationsActive = true;
      }
    },
    getRecommendedVideosSuccess(state, action) {
      const isPagination = action.payload.isPagination;
      const newItems = action.payload.data.items;
      
      state.recommendationLoading = false;
      state.isFetchingMoreRecommendations = false;
      state.recommendedVideos = {
        ...action.payload.data,
        items: isPagination 
          ? [...state.recommendedVideos.items, ...newItems]
          : newItems
      };
      state.recommendedNextPageToken = action.payload.data.nextPageToken || null;
    },
    getTrendingVideosSuccess(state, action) {
      state.trendingVideos = action.payload.data;
    },
    setWatchHistory(state, action) {
      state.watchHistory = action.payload;
    },
    addToWatchHistory(state, action) {
      // Add to beginning, limit to 100
      const updated = [action.payload, ...state.watchHistory];
      state.watchHistory = updated.slice(0, 100);
    },
    updateUserPreferences(state, action) {
      state.userPreferences = {
        ...state.userPreferences,
        ...action.payload,
      };
    },
  },
});

const { actions, reducer } = YouTubeSlice;

export const {
  getYouTubeVideos,
  getYouTubeVideosMore,
  getYouTubeVideosSuccess,
  getYouTubeVideosFail,
  getYouTubeChannelsSuccess,
  getYouTubeCategoriesSuccess,
  setSearchQuery,
  setSelectedCategory,
  setCurrentRegion,
  setRandomCategory,
  resetFilters,
  getVideoDetailsSuccess,
  getVideoCommentsSuccess,
  getRelatedVideos,
  getRelatedVideosSuccess,
  getPlaylistsSuccess,
  getPlaylistItemsSuccess,
  getSubscriptionsSuccess,
  getCaptionsSuccess,
  getActivitiesSuccess,
  getI18nLanguagesSuccess,
  getI18nRegionsSuccess,
  getShortsSuccess,
  getExploreVideos,
  getExploreVideosSuccess,
  toggleTheme,
  // Recommendation actions
  getRecommendedVideos,
  getRecommendedVideosSuccess,
  getTrendingVideosSuccess,
  setWatchHistory,
  addToWatchHistory,
  updateUserPreferences,
} = actions;

export default reducer;

