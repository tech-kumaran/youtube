import React, { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Header/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContainer from "./MainContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getYouTubeVideoAction } from "./actions/youTubeActions";
import { initializeAuthAction } from "./actions/authActions";
import CategoryNav from "../components/CategoryNav";

// Lazy load components for performance
const Shorts = React.lazy(() => import("./Shorts"));
const Subscriptions = React.lazy(() => import("./Subscriptions"));
const Playlists = React.lazy(() => import("./Playlists"));
const History = React.lazy(() => import("./History"));
const WatchLater = React.lazy(() => import("./WatchLater"));
const LikedVideos = React.lazy(() => import("./LikedVideos"));
const Library = React.lazy(() => import("./Library"));
const Explore = React.lazy(() => import("./Explore"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-[80vh] text-white">
    <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
  </div>
);

const YouTubeApp = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeView, setActiveView] = useState("Home");
  const location = useLocation();
  
  const toggle = () => {
    setShowSidebar(!showSidebar);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  useEffect(() => {
    // Initial app initialization
    dispatch(initializeAuthAction());
  }, [dispatch]);

  const {
    loading,
    recommendationLoading,
    videos: { items },
    recommendedVideos,
    isRecommendationsActive,
    channelDetails,
  } = useSelector((state) => state.youTubeState);

  // Consolidate loading states
  const isAnyLoading = loading || recommendationLoading;

  // Use recommended videos for Home feed if recommendations are active, otherwise fallback to standard videos
  const homeVideos = (activeView === "Home" && isRecommendationsActive && recommendedVideos?.items?.length > 0) 
    ? recommendedVideos.items 
    : items;

  useEffect(() => {
    if (activeView === "Home") {
      // If we're on Home, ensure we have initial content
      // The initializeAuthAction already fetches recommendations, 
      // which we can use for the Home feed if we want.
      // For now, let's keep the getYouTubeVideoAction call if it's the primary feed.
      dispatch(getYouTubeVideoAction);
    }
  }, [dispatch, activeView]);

  const handleCategoryClick = () => {
    if (activeView !== "Home") {
      setActiveView("Home");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "Shorts":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Shorts />
          </Suspense>
        );
      case "Subscriptions":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Subscriptions showSidebar={showSidebar} />
          </Suspense>
        );
      case "Library":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Library />
          </Suspense>
        );
      case "History":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <History />
          </Suspense>
        );
      case "Watch Later":
         return (
          <Suspense fallback={<LoadingFallback />}>
             <WatchLater />
          </Suspense>
         );
      case "Liked Videos":
         return (
          <Suspense fallback={<LoadingFallback />}>
             <LikedVideos />
          </Suspense>
         );
      case "Trending":
      case "Shopping":
      case "Music":
      case "Movies":
      case "Live":
      case "Gaming":
      case "News":
      case "Sports":
      case "Learning":
      case "Fashion & Beauty":
         return (
          <Suspense fallback={<LoadingFallback />}>
             <Explore category={activeView} />
          </Suspense>
         );
      case "Playlists":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Playlists />
          </Suspense>
        );
      default:
        return (
          <MainContainer
            showSidebar={showSidebar}
            isLoading={isAnyLoading}
            youTubeVideoList={{ items: homeVideos }}
            channelDetails={channelDetails}
          />
        );
    }
  };

  return (
    <div className="bg-gray-900 h-screen overflow-hidden">
      <Navbar setShowSidebar={toggle} />
      <div className="flex h-full pt-14">
        <Sidebar 
          showSidebar={showSidebar} 
          activeView={activeView}
          onViewChange={setActiveView}
          onClose={() => setShowSidebar(false)}
        />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          showSidebar ? "md:pl-[72px]" : "md:pl-[240px]"
        } pl-0`}>
          <CategoryNav onCategoryClick={handleCategoryClick} />
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default YouTubeApp;
