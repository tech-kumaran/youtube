import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { getShortsAction } from "../actions/youTubeActions";
import { ThumbsUp, ThumbsDown, ChatCircleDots, ShareNetwork, DotsThreeVertical } from "phosphor-react";

const Shorts = () => {
  const dispatch = useDispatch();
  const { shorts, loading } = useSelector((state) => state.youTubeState);
  const containerRef = useRef();

  useEffect(() => {
    dispatch(getShortsAction());
  }, [dispatch]);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      loop: 1,
      rel: 0,
    },
  };

  if (loading && !shorts.items?.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-[calc(100vh-56px)] overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide md:pl-[72px]"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {shorts.items?.map((video, index) => (
        <div 
          key={video.id}
          className="h-[calc(100vh-56px)] w-full flex items-center justify-center snap-start relative"
        >
          {/* Video Player Container */}
          <div className="h-full md:h-[90%] w-full md:w-auto md:aspect-[9/16] bg-gray-900 md:rounded-2xl overflow-hidden relative shadow-2xl border-x md:border border-white/10">
            <YouTube 
              videoId={video.id}
              opts={opts}
              className="absolute inset-0 w-full h-full"
              onEnd={(e) => e.target.playVideo()} // Loop
            />
            
            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-20 md:pb-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-2 ring-white/20">
                  <img src={`https://ui-avatars.com/api/?name=${video.snippet.channelTitle}`} alt="" />
                </div>
                <span className="font-bold text-base md:text-sm">@{video.snippet.channelTitle}</span>
                <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-base md:text-sm line-clamp-2 pr-12">{video.snippet.title}</p>
            </div>
          </div>

          {/* Side Actions */}
          <div className="absolute right-2 md:right-4 bottom-24 md:bottom-20 flex flex-col gap-5 md:gap-6 items-center z-10">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-800/60 p-3.5 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer transition-colors backdrop-blur-md">
                <ThumbsUp size={26} weight="fill" className="text-white" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">{formatCount(video.statistics.likeCount)}</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-800/60 p-3.5 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer transition-colors backdrop-blur-md">
                <ThumbsDown size={26} weight="fill" className="text-white" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">Dislike</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-800/60 p-3.5 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer transition-colors backdrop-blur-md">
                <ChatCircleDots size={26} weight="fill" className="text-white" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">{formatCount(video.statistics.commentCount)}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="bg-gray-800/60 p-3.5 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer transition-colors backdrop-blur-md">
                <ShareNetwork size={26} weight="fill" className="text-white" />
              </div>
              <span className="text-xs font-semibold text-white drop-shadow-md">Share</span>
            </div>

            <div className="bg-gray-800/60 p-3.5 md:p-3 rounded-full hover:bg-gray-700 cursor-pointer transition-colors backdrop-blur-md">
              <DotsThreeVertical size={24} weight="bold" className="text-white" />
            </div>

            <div className="w-10 h-10 rounded-lg bg-gray-700 overflow-hidden ring-2 ring-white/20 mt-2">
               <img src={video.snippet.thumbnails.default.url} className="w-full h-full object-cover animate-spin-slow" alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


const formatCount = (count) => {
  if (!count) return "0";
  count = parseInt(count);
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
};

export default Shorts;
