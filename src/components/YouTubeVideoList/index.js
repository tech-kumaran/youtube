import React from "react";
import YoutubeVideoCard from "../YoutubeVideoCard";


const YouTubeVideoList = ({ youTubeVideoList, channelDetails, videoPlayerList }) => {
  // Support both API list (youTubeVideoList.items) and mock list (videoPlayerList)
  const videos = (Array.isArray(youTubeVideoList) ? youTubeVideoList : youTubeVideoList?.items) || videoPlayerList || [];


  return (
    videos.map((video, index) => (
      <YoutubeVideoCard 
        key={video.id?.videoId || video.id || index} 
        video={video} 
        channelDetails={channelDetails} 
      />
    ))
  );
};

export const ShimmerCard = () => (
  <div className="flex flex-col gap-2 w-full animate-pulse">
    <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-[12px] relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer"></div>
    </div>
    <div className="flex py-4 gap-3">
      <div className="h-9 w-9 min-w-[36px] bg-gray-200 dark:bg-gray-800 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer"></div>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

export const YouTubeVideoListShimmer = ({ count = 8 }) => (
  <>
    {Array(count).fill(0).map((_, i) => (
      <ShimmerCard key={i} />
    ))}
  </>
);

export default YouTubeVideoList;
