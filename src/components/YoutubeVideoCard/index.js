import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import YouTube from "react-youtube";
import Avatar from "react-avatar";
import moment from "moment";

const YoutubeVideoCard = ({ video, channelDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutMs = 800; // Delay before playing
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, hoverTimeoutMs);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(false);
  };

  function formatNumber(number) {
    if (number >= 1e9) {
      return (number / 1e9).toFixed(1) + "b";
    } else if (number >= 1e6) {
      return (number / 1e6).toFixed(1) + "m";
    } else if (number >= 1e3) {
      return (number / 1e3).toFixed(1) + "k";
    } else {
      return number.toString();
    }
  }

  const formatDuration = (duration) => {
    // Check if duration is already in "MM:SS" format (mock data)
    if (typeof duration === "string" && duration.includes(":")) return duration;

    // Otherwise handle ISO duration (API data)
    try {
      const seconds = moment.duration(duration).asSeconds();
      return moment.utc(seconds * 1000).format("mm:ss");
    } catch (e) {
      return "00:00";
    }
  };

  const formatData = (data) => {
    // Check if data is already in "ago" format (mock data)
    if (typeof data === "string" && data.includes("ago")) return data;

    const customFromNow = moment(data).fromNow();
    return customFromNow.replace(/a day ago/, "1 day ago");
  };

  // Handle both API data structure and mock data structure
  const videoId = video.id?.videoId || video.id;
  const snippet = video.snippet || {};
  const statistics = video.statistics || {};
  const contentDetails = video.contentDetails || {};

  // Mock data fallbacks
  const thumbnail =
    snippet.thumbnails?.standard?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    video.thumbnail;

  const isMock = !video.snippet;

  const displayTitle = isMock ? video.description : snippet.title;
  const displayChannel = isMock ? video.title : snippet.channelTitle;
  const displayViewCount = isMock ? video.ViewCount : statistics.viewCount;
  const displayDate = isMock ? video.date : snippet.publishedAt;
  const displayDuration = isMock ? video.durations : contentDetails.duration;
  const displayChannelId = isMock ? null : snippet.channelId;

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div
      className="card flex flex-col gap-2 cursor-pointer bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-xl p-0 sm:p-2 sm:-m-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/watch?v=${videoId}`}
        className="w-full aspect-video relative rounded-[12px] overflow-hidden bg-gray-200 dark:bg-gray-800 block"
      >
        {/* Helper to keep aspect ratio if needed, but 'aspect-video' util does it */}
        {isHovered ? (
          <div className="w-full h-full pointer-events-none">
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onPlayerReady}
              className="w-full h-full"
              iframeClassName="w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            <img
              src={thumbnail}
              className="w-full h-full object-cover"
              alt={displayTitle}
            />
            <span className="bg-black/80 text-white absolute right-2 bottom-2 text-xs px-1 py-1 rounded">
              {displayDuration ? formatDuration(displayDuration) : "00:00"}
            </span>
          </>
        )}
      </Link>
      <ul>
        <li className="flex py-2">
          <Link to={`/watch?v=${videoId}`} className="flex-shrink-0">
            <Avatar
              name={displayChannel}
              src={
                video.channelThumbnail ||
                channelDetails?.items?.find(
                  (channel) => channel.id === displayChannelId,
                )?.snippet.thumbnails.default.url
              }
              size="36"
              round={true}
              className="min-h-[36px] min-w-[36px]"
            />
          </Link>
          <div className="ml-3 overflow-hidden flex-1">
            <Link to={`/watch?v=${videoId}`}>
              <p className="text-sm md:text-base font-bold text-black dark:text-white mb-1 line-clamp-2 leading-tight">
                {displayTitle}
              </p>
            </Link>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              {displayChannel}
            </p>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {displayViewCount ? formatNumber(displayViewCount) : "0"} views •{" "}
              {formatData(displayDate)}
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default YoutubeVideoCard;
