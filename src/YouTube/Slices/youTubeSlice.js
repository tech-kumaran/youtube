import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isFetchingMore: false,
  videos: { items: [] },
  nextPageToken: null,
  videoCategories: [],
  searchQuery: "",
  selectedCategory: "All",
  order: "relevance",
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
      return {
        ...state,
        searchQuery: action.payload,
      };
    },
    setSelectedCategory(state, action) {
      return {
        ...state,
        selectedCategory: action.payload,
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
        selectedCategory: "All",
        nextPageToken: null,
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
} = actions;

export default reducer;

