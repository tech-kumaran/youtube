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

export const getRelatedVideosAction = (videoId, title) => async (dispatch) => {
  try {
    dispatch(getRelatedVideos());
    const query = title?.split(" ").slice(0, 3).join(" ") || "Trending";
    
    const response = await axios.get(SEARCH_API_URL, {
      params: {
        part: "snippet",
        type: "video",
        maxResults: 50,
        q: query,
        key: API_KEY,
        regionCode: "IN",
      },
    });
    dispatch(getRelatedVideosSuccess(response));
  } catch (error) {
    console.error("Error fetching related videos:", error.message);
  }
};

export const getVideoCategoriesAction = () => async (dispatch) => {
  try {
    const response = await axios.get(CATEGORIES_API_URL, {
      params: {
        part: "snippet",
        regionCode: "IN",
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
    const { searchQuery, selectedCategory, nextPageToken } = getState().youTubeState;
    
    if (isPagination) {
      if (!nextPageToken) return;
      dispatch(getYouTubeVideosMore());
    } else {
      dispatch(getYouTubeVideos());
    }

    let response;
    const effectiveQuery = searchQuery; // Only use search query if explicitly typed

    // Case 1: Text Search (Expensive: 100 units)
    if (effectiveQuery && effectiveQuery !== "") {
      const searchParams = {
        part: "snippet",
        maxResults: 50,
        key: API_KEY,
        q: effectiveQuery,
        type: "video",
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
        regionCode: "IN",
      };

      if (selectedCategory && selectedCategory !== "All") {
        popularParams.videoCategoryId = selectedCategory;
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
export const getExploreVideosAction = (category) => async (dispatch) => {
  try {
    dispatch(getExploreVideos());
    
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
          regionCode: "IN",
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
          regionCode: "IN",
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


