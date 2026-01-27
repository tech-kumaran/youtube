import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, ShareNetwork, DownloadSimple, DotsThreeOutlineVertical, CaretDown } from "phosphor-react";
import moment from "moment";

export default function Description({ video, comments }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!video) return (
    <div className="animate-pulse py-5">
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-800 rounded-full w-48 mb-6"></div>
      <div className="h-24 bg-gray-800 rounded-xl w-full"></div>
    </div>
  );

  const { snippet, statistics } = video;
  
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="text-white pt-4 px-4 sm:px-0">
      <h1 className="text-lg md:text-xl font-bold line-clamp-2">{snippet.title}</h1>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            {/* Channel logo will be fetched from details if available, otherwise fallback */}
            <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-blue-600">
              {snippet.channelTitle[0]}
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-base leading-tight hover:text-gray-300 cursor-pointer">
              {snippet.channelTitle}
            </h3>
            <p className="text-xs text-gray-400">
              {formatNumber(statistics?.viewCount)} views
            </p>
          </div>
          <button className="ml-auto sm:ml-4 bg-white text-black px-4 py-1.5 md:py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Subscribe
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center bg-white/10 rounded-full h-9">
            <button className="flex items-center gap-2 px-4 hover:bg-white/10 h-full border-r border-white/10 transition-colors">
              <ThumbsUp size={20} weight="regular" />
              <span className="text-sm font-medium">{formatNumber(statistics?.likeCount)}</span>
            </button>
            <button className="px-4 hover:bg-white/10 h-full transition-colors">
              <ThumbsDown size={20} weight="regular" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full h-9 hover:bg-white/20 transition-colors">
            <ShareNetwork size={20} />
            <span className="text-sm font-medium">Share</span>
          </button>
          
          <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full h-9 hover:bg-white/20 transition-colors">
            <DownloadSimple size={20} />
            <span className="text-sm font-medium">Download</span>
          </button>

          <button className="flex items-center justify-center bg-white/10 w-9 h-9 rounded-full hover:bg-white/20 transition-colors">
            <DotsThreeOutlineVertical size={20} weight="fill" />
          </button>
        </div>
      </div>

      {/* Description Box */}
      <div className="mt-4 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 cursor-pointer" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
        <div className="flex gap-2 text-sm font-bold mb-1">
          <span>{formatNumber(statistics?.viewCount)} views</span>
          <span>{moment(snippet.publishedAt).fromNow()}</span>
        </div>
        <p className={`text-sm whitespace-pre-wrap ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>
          {snippet.description}
        </p>
        <button className="text-sm font-bold mt-1">
          {isDescriptionExpanded ? "Show less" : "Show more"}
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6 mb-10">
        <h3 className="text-xl font-bold mb-6">
          {statistics?.commentCount ? `${formatNumber(statistics.commentCount)} Comments` : "Comments"}
        </h3>
        
        <div className="flex flex-col gap-6">
          {comments?.map((comment) => {
            const commentData = comment.snippet.topLevelComment.snippet;
            return (
              <div key={comment.id} className="flex gap-4">
                <img 
                  src={commentData.authorProfileImageUrl} 
                  className="w-10 h-10 rounded-full" 
                  alt={commentData.authorDisplayName}
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">@{commentData.authorDisplayName}</span>
                    <span className="text-xs text-gray-400">{moment(commentData.publishedAt).fromNow()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{commentData.textDisplay}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <ThumbsUp size={16} />
                      <span className="text-xs text-gray-400">{commentData.likeCount > 0 ? formatNumber(commentData.likeCount) : ""}</span>
                    </div>
                    <ThumbsDown size={16} className="cursor-pointer" />
                    <span className="text-xs font-bold cursor-pointer hover:bg-white/10 px-2 py-1 rounded-full">Reply</span>
                  </div>
                  {comment.snippet.totalReplyCount > 0 && (
                     <div className="mt-1 flex items-center gap-1.5 text-blue-400 text-sm font-bold cursor-pointer hover:bg-blue-900/30 w-fit px-2 py-1 rounded-full transition-colors">
                       <CaretDown size={16} weight="bold" />
                       <span>{comment.snippet.totalReplyCount} replies</span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
