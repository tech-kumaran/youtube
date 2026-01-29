import React, { useRef, useEffect, useCallback } from "react";
import { ytVideo } from "./data";
import { useDispatch, useSelector } from "react-redux";
import {
  getYouTubeVideoAction,
  getVideoCategoriesAction,
} from "../actions/youTubeActions";

import YouTubeVideoList, {
  YouTubeVideoListShimmer,
} from "../../components/YouTubeVideoList";

const MainContainer = ({ youTubeVideoList, isLoading, channelDetails }) => {
  const dispatch = useDispatch();
  const { 
    nextPageToken, 
    recommendedNextPageToken,
    isRecommendationsActive,
    isFetchingMore,
    isFetchingMoreRecommendations,
    recommendationLoading
  } = useSelector(
    (state) => state.youTubeState,
  );
  
  const effectiveNextPageToken = isRecommendationsActive ? recommendedNextPageToken : nextPageToken;
  const effectiveIsFetchingMore = isRecommendationsActive ? isFetchingMoreRecommendations : isFetchingMore;
  const effectiveIsLoading = isLoading || (isRecommendationsActive && recommendationLoading);

  const gridContainerRef = useRef(null);

  const handleVerticalScroll = useCallback(() => {
    if (gridContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        gridContainerRef.current;
      // If user reached within 100px of bottom and not currently fetching
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !effectiveIsFetchingMore &&
        effectiveNextPageToken
      ) {
        dispatch((dispatch, getState) =>
          getYouTubeVideoAction(dispatch, getState, true),
        );
      }
    }
  }, [effectiveIsFetchingMore, effectiveNextPageToken, dispatch]);

  useEffect(() => {
    dispatch(getVideoCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    // Grid scroll listener for infinite pagination
    const gridContainer = gridContainerRef.current;
    if (gridContainer) {
      gridContainer.addEventListener("scroll", handleVerticalScroll);
    }

    return () => {
      if (gridContainer) {
        gridContainer.removeEventListener("scroll", handleVerticalScroll);
      }
    };
  }, [gridContainerRef, effectiveIsFetchingMore, effectiveNextPageToken, handleVerticalScroll]);

  return (
    <div className="bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out h-full flex flex-col">
      {/* Video Grid */}
      <div
        ref={gridContainerRef}
        className="px-0 sm:px-4 md:px-6 py-4 flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="grid gap-y-8 gap-x-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {effectiveIsLoading && !youTubeVideoList?.items?.length ? (
            <YouTubeVideoListShimmer count={8} />
          ) : (
            <>
              <YouTubeVideoList
                videoPlayerList={ytVideo}
                youTubeVideoList={youTubeVideoList}
                channelDetails={channelDetails}
              />
              {effectiveIsFetchingMore && <YouTubeVideoListShimmer count={4} />}
            </>
          )}
        </div>

        {/* End of list message */}
        {!effectiveNextPageToken &&
          !effectiveIsLoading &&
          youTubeVideoList?.items?.length > 0 && (
            <div className="flex justify-center py-8">
              <span className="text-gray-500 text-sm italic">
                You've reached the end of the list
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default MainContainer;
