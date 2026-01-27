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
  const { nextPageToken, isFetchingMore } = useSelector(
    (state) => state.youTubeState,
  );
  const gridContainerRef = useRef(null);

  const handleVerticalScroll = useCallback(() => {
    if (gridContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        gridContainerRef.current;
      // If user reached within 100px of bottom and not currently fetching
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isFetchingMore &&
        nextPageToken
      ) {
        dispatch((dispatch, getState) =>
          getYouTubeVideoAction(dispatch, getState, true),
        );
      }
    }
  }, [isFetchingMore, nextPageToken, dispatch]);

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
  }, [gridContainerRef, isFetchingMore, nextPageToken, handleVerticalScroll]);

  return (
    <div className="bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out h-full flex flex-col">
      {/* Video Grid */}
      <div
        ref={gridContainerRef}
        className="px-2 sm:px-6 py-4 flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
      >
        <div className="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 mb-8">
          {isLoading && !youTubeVideoList?.items?.length ? (
            <YouTubeVideoListShimmer count={8} />
          ) : (
            <>
              <YouTubeVideoList
                videoPlayerList={ytVideo}
                youTubeVideoList={youTubeVideoList}
                channelDetails={channelDetails}
              />
              {isFetchingMore && <YouTubeVideoListShimmer count={4} />}
            </>
          )}
        </div>

        {/* End of list message */}
        {!nextPageToken &&
          !isLoading &&
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
