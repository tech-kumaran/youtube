import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Avatar from "react-avatar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Description from "./components/Description";
import Navbar from "../../components/Header/Navbar";
import { 
  getVideoDetailsAction, 
  getVideoCommentsAction, 
  getRelatedVideosAction,
  trackPlaybackAction
} from "../actions/youTubeActions";

const YouTubeVideo = () => {
  const containerRef = useRef();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get("v");

  const onSelectPlayVideo = (id) => {
    const url = `watch?v=${id}`;
    window.location.href = url;
  };
  
  const onPlayerPlay = (event) => {
    if (currentVideoDetails) {
      dispatch(trackPlaybackAction(currentVideoDetails));
    }
  };

  const opts = {
    height: "740",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const toggle = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const dispatch = useDispatch();

  const {
    currentVideoDetails,
    videoComments,
    relatedVideos,
    isFetchingRelated,
  } = useSelector((state) => state.youTubeState);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoDetailsAction(videoId));
      dispatch(getVideoCommentsAction(videoId));
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (currentVideoDetails?.snippet?.title) {
      dispatch(getRelatedVideosAction(videoId, currentVideoDetails.snippet.title));
    }
  }, [dispatch, videoId, currentVideoDetails?.snippet?.title]);


  const formatData = (data) => {
    return moment(data).fromNow();
  };

  return (
    <div className="bg-white dark:bg-[#0f0f0f] min-h-screen text-black dark:text-white overflow-x-hidden transition-colors duration-300">
      <Navbar setShowSidebar={toggle} />
      <Sidebar 
        showSidebar={showSidebar} 
        onClose={() => setShowSidebar(false)} 
        isOverlayMode={true}
      />
      
      <div className="max-w-[1720px] mx-auto px-0 sm:px-4 lg:px-6 pt-0 sm:pt-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main content Area */}
        <div className="flex-1">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-gray-200 dark:ring-white/10 shadow-2xl">
            <YouTube 
              videoId={videoId} 
              onPlay={onPlayerPlay}
              opts={{
                ...opts,
                height: "100%",
                width: "100%",
                playerVars: { 
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0,
                }
              }} 
              className="absolute inset-0 w-full h-full" 
            />
          </div>

          <Description 
            video={currentVideoDetails} 
            comments={videoComments}
          />
        </div>

        {/* Sidebar / Suggested Videos */}
        <div className="w-full lg:w-[402px] flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {relatedVideos?.items?.map((video, index) => {
              if (!video.snippet) return null;
              return (
                <div
                  className="flex gap-2 cursor-pointer group hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  key={video.id.videoId || index}
                  onClick={() => onSelectPlayVideo(video.id.videoId)}
                >
                  <div className="relative min-w-[168px] w-[168px] aspect-video">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      className="rounded-lg object-cover w-full h-full group-hover:rounded-none transition-all"
                      alt={video.snippet.title}
                    />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <h3 className="text-sm font-medium line-clamp-2 leading-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {video.snippet.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar 
                        name={video.snippet.channelTitle} 
                        size="24" 
                        round={true} 
                        className="min-w-[24px]"
                      />
                      <p className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {video.snippet.channelTitle}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatData(video.snippet.publishedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {(isFetchingRelated) && 
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex gap-2 animate-pulse p-2">
                  <div className="min-w-[168px] w-[168px] aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                  <div className="flex-1 flex flex-col gap-2 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideo;
