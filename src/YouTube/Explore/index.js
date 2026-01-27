import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getExploreVideosAction } from "../actions/youTubeActions";
import YoutubeVideoCard from "../../components/YoutubeVideoCard";
import { YouTubeVideoListShimmer } from "../../components/YouTubeVideoList";

const Explore = ({ category }) => {
  const dispatch = useDispatch();
  const { exploreVideos, isFetchingExplore } = useSelector((state) => state.youTubeState);

  useEffect(() => {
    if (category) {
      dispatch(getExploreVideosAction(category));
    }
  }, [category, dispatch]);

  const videos = exploreVideos?.items || [];

  return (
    <div className="p-4 sm:p-6 h-full overflow-y-auto custom-scrollbar text-black dark:text-white bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{category || "Explore"}</h2>
        <p className="text-gray-600 dark:text-gray-400">Trending content in {category}.</p>
      </div>
      
      <div className="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 pb-8">
        {isFetchingExplore ? (
          <YouTubeVideoListShimmer count={9} />
        ) : (
          videos.map((video, index) => (
            <YoutubeVideoCard key={video.id?.videoId || video.id || index} video={video} />
          ))
        )}
      </div>

      {!isFetchingExplore && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500">No videos found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
