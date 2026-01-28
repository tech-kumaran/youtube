// import axios from "axios";
// import {
//   getYouTubeVideos,
//   getYouTubeVideosSuccess,
//   getYouTubeVideosFail,
//   getYouTubeChannelsSuccess,
// } from "../Slices/youTubeSlice";

// const API_KEY = "AIzaSyCngUiHFC-khbq0g4hiNddBgsRibC96GPw";
// const API_URL = "https://www.googleapis.com/youtube/v3/videos";
// const CHANNEL_API_URL = "https://www.googleapis.com/youtube/v3/channels";

// export const getYouTubeVideoAction = async (dispatch) => {
//   try {
//     dispatch(getYouTubeVideos());

//     const response = await axios.get(API_URL, {
//       params: {
//         part: "snippet,contentDetails,statistics,topicDetails,status,recordingDetails,player",
//         maxResults: 2,
//         key: API_KEY,
//         chart: "mostPopular",
//         regionCode: "IN",
//         pageToken: "CCgQAA",
//       },
//     });

//     const channelIds = await response.data.items.map(
//       (item) => item.snippet.channelId
//     );

//     async function fetchChannelDetails(channelIds, dispatch) {
//       try {
//         const response = await axios.get(CHANNEL_API_URL, {
//           params: {
//             part: "snippet",
//             key: API_KEY,
//             id: channelIds.join(","), // Use join to concatenate multiple channel ids
//           },
//         });
//         dispatch(getYouTubeChannelsSuccess(response));
//       } catch (error) {
//         console.error("Error fetching channel details:", error.message);
//         // Optional: rethrow the error if necessary
//         throw error;
//       }
//     }
//     fetchChannelDetails();

//     dispatch(getYouTubeVideosSuccess(response));
//   } catch (error) {
//     dispatch(getYouTubeVideosFail(error));
//   }
// };

import axios from "axios";
import {
  getYouTubeVideos,
  getYouTubeVideosMore,
  getYouTubeVideosSuccess,
  getYouTubeVideosFail,
  getYouTubeChannelsSuccess,
  getYouTubeCategoriesSuccess,
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
  setCurrentRegion,
} from "../Slices/youTubeSlice";
import { setUserRegion } from "../Slices/authSlice";
import { getAuthToken, getUserEmail } from "../utils/authUtils";
import { getUserRegion } from "../utils/locationUtils";
import { 
  getRecentlyWatched, 
  addSearchQuery, 
  getWatchHistory, 
  getTopCategories,
  addToWatchHistory as addToLog
} from "../utils/watchHistoryUtils";
import { 
  getPersonalizedRecommendations,
  getContextFromHistory 
} from "../utils/recommendationEngine";
import { 
  setWatchHistory, 
  addToWatchHistory as addToSlice, 
  updateUserPreferences,
  getRecommendedVideos,
  getRecommendedVideosSuccess,
  getTrendingVideosSuccess
} from "../Slices/youTubeSlice";

const API_KEY = "AIzaSyCngUiHFC-khbq0g4hiNddBgsRibC96GPw";
const VIDEOS_API_URL = "https://www.googleapis.com/youtube/v3/videos";
const SEARCH_API_URL = "https://www.googleapis.com/youtube/v3/search";
const CHANNEL_API_URL = "https://www.googleapis.com/youtube/v3/channels";
const CATEGORIES_API_URL = "https://www.googleapis.com/youtube/v3/videoCategories";
const COMMENT_THREADS_API_URL = "https://www.googleapis.com/youtube/v3/commentThreads";
const PLAYLISTS_API_URL = "https://www.googleapis.com/youtube/v3/playlists";
const PLAYLIST_ITEMS_API_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const SUBSCRIPTIONS_API_URL = "https://www.googleapis.com/youtube/v3/subscriptions";
const CAPTIONS_API_URL = "https://www.googleapis.com/youtube/v3/captions";
const ACTIVITIES_API_URL = "https://www.googleapis.com/youtube/v3/activities";
const I18N_LANGUAGES_API_URL = "https://www.googleapis.com/youtube/v3/i18nLanguages";
const I18N_REGIONS_API_URL = "https://www.googleapis.com/youtube/v3/i18nRegions";



export const getVideoDetailsAction = (videoId) => async (dispatch) => {

  try {
    const response = await axios.get(VIDEOS_API_URL, {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: API_KEY,
      },
    });
    dispatch(getVideoDetailsSuccess(response));
    
    // Also fetch channel details for this video's channel
    const channelId = response.data.items[0].snippet.channelId;
    const channelResponse = await axios.get(CHANNEL_API_URL, {
      params: {
        part: "snippet,statistics",
        id: channelId,
        key: API_KEY,
      },
    });
    dispatch(getYouTubeChannelsSuccess(channelResponse));
  } catch (error) {
    console.error("Error fetching video details:", error.message);
  }
};

export const getVideoCommentsAction = (videoId) => async (dispatch) => {
  try {
    const response = await axios.get(COMMENT_THREADS_API_URL, {
      params: {
        part: "snippet",
        videoId: videoId,
        maxResults: 20,
        key: API_KEY,
      },
    });
    dispatch(getVideoCommentsSuccess(response));
  } catch (error) {
    console.error("Error fetching comments:", error.message);
  }
};

export const getRelatedVideosAction = (videoId, title) => async (dispatch, getState) => {
  try {
    dispatch(getRelatedVideos());
    
    // Get user's region from auth state
    const { authState } = getState();
    const userRegion = authState.userRegion || await getUserRegion();
    
    const query = title?.split(" ").slice(0, 3).join(" ") || "Trending";
    
    const response = await axios.get(SEARCH_API_URL, {
      params: {
        part: "snippet",
        type: "video",
        maxResults: 50,
        q: query,
        key: API_KEY,
        regionCode: userRegion,
      },
    });
    dispatch(getRelatedVideosSuccess(response));
  } catch (error) {
    console.error("Error fetching related videos:", error.message);
  }
};

export const getVideoCategoriesAction = (regionCode) => async (dispatch) => {

  try {
    const response = await axios.get(CATEGORIES_API_URL, {
      params: {
        part: "snippet",
        regionCode: regionCode || "IN",
        key: API_KEY,
      },
    });
    dispatch(getYouTubeCategoriesSuccess(response));
  } catch (error) {
    console.error("Error fetching categories:", error.message);
  }
};

export const getYouTubeVideoAction = async (dispatch, getState, isPagination = false) => {
  try {
    const { 
      searchQuery, 
      selectedCategory, 
      nextPageToken, 
      currentRegion, 
      isRecommendationsActive 
    } = getState().youTubeState;
    
    // If recommendation system is active and we are on Home (no search/category), use it
    if (isRecommendationsActive && !searchQuery && selectedCategory === "all") {
      return dispatch(fetchRecommendationsAction(isPagination));
    }

    if (isPagination) {
      if (!nextPageToken) return;
      dispatch(getYouTubeVideosMore());
    } else {
      dispatch(getYouTubeVideos());
    }

    let response;
    const effectiveQuery = searchQuery; // Only use search query if explicitly typed
    
    // Determine region to use
    const regionCode = currentRegion;
    
    // Determine category to use
    const categoryToUse = selectedCategory;

    // Case 1: Text Search (Expensive: 100 units)
    if (effectiveQuery && effectiveQuery !== "") {
      const searchParams = {
        part: "snippet",
        maxResults: 50,
        key: API_KEY,
        q: effectiveQuery,
        type: "video",
        order: "relevance",
      };

      if (isPagination && nextPageToken) {
        searchParams.pageToken = nextPageToken;
      }

      const searchResponse = await axios.get(SEARCH_API_URL, {
        params: searchParams,
      });

      const videoIds = searchResponse.data.items.map(item => item.id.videoId);
      
      response = await axios.get(VIDEOS_API_URL, {
        params: {
          part: "snippet,contentDetails,statistics,topicDetails,status,recordingDetails,player",
          key: API_KEY,
          id: videoIds.join(","),
        },
      });

      response.data.nextPageToken = searchResponse.data.nextPageToken;
    } 
    // Case 2: Category Filter or Default Popular (Cheap: 1 unit)
    else {
      const popularParams = {
        part: "snippet,contentDetails,statistics,topicDetails,status,recordingDetails,player",
        maxResults: 50,
        key: API_KEY,
        chart: "mostPopular",
        regionCode: regionCode,
      };

      if (categoryToUse && categoryToUse !== "all") {
        popularParams.videoCategoryId = categoryToUse;
        // YouTube API requirement: chart must be mostPopular when filtering by videoCategoryId
      }

      if (isPagination && nextPageToken) {
        popularParams.pageToken = nextPageToken;
      }

      response = await axios.get(VIDEOS_API_URL, {
        params: popularParams,
      });
    }

    const channelIds = response.data.items.map(
      (item) => item.snippet.channelId
    );

    const fetchChannelDetails = async (channelIds, dispatch) => {
      if (!channelIds.length) return;
      try {
        const channelResponse = await axios.get(CHANNEL_API_URL, {
          params: {
            part: "snippet,statistics",
            key: API_KEY,
            id: channelIds.join(","),
          },
        });
        dispatch(getYouTubeChannelsSuccess(channelResponse));
      } catch (error) {
        console.error("Error fetching channel details:", error.message);
        throw error;
      }
    };

    await fetchChannelDetails(channelIds, dispatch);
    dispatch(getYouTubeVideosSuccess({ data: response.data, isPagination }));
  } catch (error) {
    dispatch(getYouTubeVideosFail(error.message));
  }
};

// New Actions for the requested endpoints

export const getPlaylistsAction = (channelId) => async (dispatch) => {
  try {
    const response = await axios.get(PLAYLISTS_API_URL, {
      params: {
        part: "snippet,contentDetails",
        channelId: channelId, // Or mine: true if authenticated
        maxResults: 50,
        key: API_KEY,
      },
    });
    dispatch(getPlaylistsSuccess(response));
  } catch (error) {
    console.error("Error fetching playlists:", error.message);
  }
};

export const getPlaylistItemsAction = (playlistId) => async (dispatch) => {
  try {
    const response = await axios.get(PLAYLIST_ITEMS_API_URL, {
      params: {
        part: "snippet,contentDetails",
        playlistId: playlistId,
        maxResults: 50,
        key: API_KEY,
      },
    });
    dispatch(getPlaylistItemsSuccess(response));
  } catch (error) {
    console.error("Error fetching playlist items:", error.message);
  }
};

export const getSubscriptionsAction = (channelId) => async (dispatch) => {
  try {
    const response = await axios.get(SUBSCRIPTIONS_API_URL, {
      params: {
        part: "snippet,contentDetails",
        channelId: channelId, // Or mine: true
        maxResults: 50,
        key: API_KEY,
      },
    });
    dispatch(getSubscriptionsSuccess(response));
  } catch (error) {
    console.error("Error fetching subscriptions:", error.message);
  }
};

export const getCaptionsAction = (videoId) => async (dispatch) => {
  try {
    const response = await axios.get(CAPTIONS_API_URL, {
      params: {
        part: "snippet",
        videoId: videoId,
        key: API_KEY,
      },
    });
    dispatch(getCaptionsSuccess(response));
  } catch (error) {
    console.error("Error fetching captions:", error.message);
  }
};

export const getActivitiesAction = (channelId) => async (dispatch) => {
  try {
    const response = await axios.get(ACTIVITIES_API_URL, {
      params: {
        part: "snippet,contentDetails",
        channelId: channelId,
        maxResults: 50,
        key: API_KEY,
      },
    });
    dispatch(getActivitiesSuccess(response));
  } catch (error) {
    console.error("Error fetching activities:", error.message);
  }
};

export const getI18nLanguagesAction = async (dispatch) => {
  try {
    const response = await axios.get(I18N_LANGUAGES_API_URL, {
      params: {
        part: "snippet",
        key: API_KEY,
      },
    });
    dispatch(getI18nLanguagesSuccess(response));
  } catch (error) {
    console.error("Error fetching languages:", error.message);
  }
};

export const getI18nRegionsAction = async (dispatch) => {
  try {
    const response = await axios.get(I18N_REGIONS_API_URL, {
      params: {
        part: "snippet",
        key: API_KEY,
      },
    });
    dispatch(getI18nRegionsSuccess(response));
  } catch (error) {
    console.error("Error fetching regions:", error.message);
  }
};

export const getShortsAction = () => async (dispatch) => {
  try {
    // YouTube API doesn't have a direct "shorts" endpoint, 
    // but we can search for videos with #shorts in the query.
    const response = await axios.get(SEARCH_API_URL, {
      params: {
        part: "snippet",
        q: "#shorts",
        type: "video",
        videoDuration: "short",
        maxResults: 50,
        key: API_KEY,
        regionCode: "IN",
      },
    });

    const videoIds = response.data.items.map(item => item.id.videoId);
    
    // Fetch full details to get statistics and content details
    const fullDetailsResponse = await axios.get(VIDEOS_API_URL, {
      params: {
        part: "snippet,contentDetails,statistics",
        key: API_KEY,
        id: videoIds.join(","),
      },
    });

    dispatch(getShortsSuccess(fullDetailsResponse));
  } catch (error) {
    console.error("Error fetching shorts:", error.message);
  }
};
export const getExploreVideosAction = (category) => async (dispatch, getState) => {
  try {
    dispatch(getExploreVideos());
    
    // Get user's region from auth state or use detected region
    const { authState } = getState();
    const userRegion = authState.userRegion || await getUserRegion();
    
    let response;
    const categoryMapping = {
      "Music": "10",
      "Gaming": "20",
      "Sports": "17",
      "Movies": "1",
      "News": "25",
      "Learning": "27",
      "Fashion & Beauty": "26",
    };

    const categoryId = categoryMapping[category];

    if (category === "Trending" || categoryId) {
      // Use mostPopular
      response = await axios.get(VIDEOS_API_URL, {
        params: {
          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode: userRegion,
          maxResults: 50,
          key: API_KEY,
          ...(categoryId ? { videoCategoryId: categoryId } : {})
        },
      });
    } else {
      // Use Search API for stuff like "Live", "Shopping"
      const searchResponse = await axios.get(SEARCH_API_URL, {
        params: {
          part: "snippet",
          q: category,
          type: "video",
          maxResults: 50,
          key: API_KEY,
          regionCode: userRegion,
          ...(category === "Live" ? { eventType: "live" } : {})
        },
      });

      // Fetch full details to get statistics for search results
      const videoIds = searchResponse.data.items.map(item => item.id.videoId);
      response = await axios.get(VIDEOS_API_URL, {
        params: {
          part: "snippet,contentDetails,statistics",
          key: API_KEY,
          id: videoIds.join(","),
        },
      });
    }
    
    dispatch(getExploreVideosSuccess(response));
  } catch (error) {
    console.error("Error fetching explore videos:", error.message);
  }
};

/**
 * Initializes user's location and sets region in Redux state
 * Call this on app initialization
 */
export const initializeUserLocationAction = () => async (dispatch) => {
  try {
    const regionCode = await getUserRegion();
    console.log("User region detected:", regionCode);
    
    // Update both YouTube state and auth state
    dispatch(setCurrentRegion(regionCode));
    // If it's a new region, update currentRegion too
    dispatch(setCurrentRegion(regionCode));
    dispatch(setUserRegion(regionCode));
    
    // FETCH CATEGORIES FOR THE DETECTED REGION
    dispatch(getVideoCategoriesAction(regionCode));
    
    return regionCode;
  } catch (error) {
    console.error("Error initializing user location:", error);
    // Use default region on error
    dispatch(setCurrentRegion("US"));
    dispatch(setUserRegion("US"));
    dispatch(getVideoCategoriesAction("US"));
    return "US";
  }
};

/**
 * Fetches videos personalized for the authenticated user
 * Uses user's region and authentication token
 */
export const getUserVideosAction = async (dispatch, getState) => {
  try {
    dispatch(getYouTubeVideos());
    
    const { authState } = getState();
    const userEmail = getUserEmail();
    const authToken = getAuthToken();
    const userRegion = authState.userRegion || await getUserRegion();
    
    console.log("Fetching videos for user:", userEmail || "Guest");
    console.log("Using region:", userRegion);
    console.log("Authenticated:", !!authToken);
    
    // Fetch popular videos for user's region
    const response = await axios.get(VIDEOS_API_URL, {
      params: {
        part: "snippet,contentDetails,statistics,topicDetails,status,recordingDetails,player",
        maxResults: 50,
        key: API_KEY,
        chart: "mostPopular",
        regionCode: userRegion,
      },
      // If user is authenticated, include token in headers
      ...(authToken ? {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      } : {})
    });
    
    const channelIds = response.data.items.map(
      (item) => item.snippet.channelId
    );

    const fetchChannelDetails = async (channelIds, dispatch) => {
      if (!channelIds.length) return;
      try {
        const channelResponse = await axios.get(CHANNEL_API_URL, {
          params: {
            part: "snippet,statistics",
            key: API_KEY,
            id: channelIds.join(","),
          },
        });
        dispatch(getYouTubeChannelsSuccess(channelResponse));
      } catch (error) {
        console.error("Error fetching channel details:", error.message);
        throw error;
      }
    };

    await fetchChannelDetails(channelIds, dispatch);
    dispatch(getYouTubeVideosSuccess({ data: response.data, isPagination: false }));
  } catch (error) {
    console.error("Error fetching user videos:", error);
    dispatch(getYouTubeVideosFail(error.message));
  }
};

/**
 * Tracks video playback and updates history
 * @param {Object} video - Video object being watched
 * @param {number} watchTime - Time in seconds spent on the video
 */
export const trackPlaybackAction = (video, watchTime = 0) => (dispatch) => {
  try {
    // 1. Update local storage log
    addToLog(video, watchTime);
    
    // 2. Update Redux slice
    dispatch(addToSlice({
      videoId: video.id,
      title: video.snippet?.title,
      timestamp: new Date().toISOString()
    }));
    
    // 3. Update user preferences based on category
    const topCategories = getTopCategories(5);
    dispatch(updateUserPreferences({ topCategories }));
  } catch (error) {
    console.error("Error tracking playback:", error);
  }
};

/**
 * Tracks search query in history
 * @param {string} query - Search term
 */
export const trackSearchAction = (query) => (dispatch) => {
  try {
    addSearchQuery(query);
    dispatch(updateUserPreferences({ 
      recentSearches: [query, ...getRecentlyWatched(5).map(v => v.query)].slice(0, 10) 
    }));
  } catch (error) {
    console.error("Error tracking search:", error);
  }
};

/**
 * Fetches and generates personalized video recommendations
 */
export const fetchRecommendationsAction = (isPagination = false) => async (dispatch, getState) => {
  try {
    dispatch(getRecommendedVideos({ isPagination }));
    
    const { authState, youTubeState } = getState();
    const userRegion = authState.userRegion || "US";
    const context = getContextFromHistory();
    context.userRegion = userRegion;
    const { recommendedNextPageToken } = youTubeState;

    // Step 1: Fetch trending videos as a base
    const params = {
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: userRegion,
      maxResults: 50,
      key: API_KEY,
    };

    if (isPagination && recommendedNextPageToken) {
      params.pageToken = recommendedNextPageToken;
    }

    const response = await axios.get(VIDEOS_API_URL, { params });

    // Step 2: Use recommendation engine to score and sort
    const personalized = getPersonalizedRecommendations(response.data.items, context);
    
    dispatch(getRecommendedVideosSuccess({ 
      data: { 
        items: personalized,
        nextPageToken: response.data.nextPageToken 
      },
      isPagination
    }));
    
    // Also update trending cache if not pagination
    if (!isPagination) {
      dispatch(getTrendingVideosSuccess({ data: { items: response.data.items } }));
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
};

/**
 * Initializes history from local storage on app load
 */
export const initializeHistoryAction = () => (dispatch) => {
  try {
    const history = getWatchHistory();
    dispatch(setWatchHistory(history));
    
    const topCategories = getTopCategories(5);
    dispatch(updateUserPreferences({ topCategories }));
  } catch (error) {
    console.error("Error initializing history:", error);
  }
};



