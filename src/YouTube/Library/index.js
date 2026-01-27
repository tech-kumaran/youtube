import React from 'react';
import { ytVideo } from "../MainContainer/data";
import YoutubeVideoCard from "../../components/YoutubeVideoCard";

const Library = () => {
  return (
    <div className="p-6 h-[calc(100vh-56px)] overflow-y-auto text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Library</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">History</h3>
        <div className="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            {ytVideo.slice(0, 4).map((video, index) => (
            <YoutubeVideoCard key={index} video={video} />
            ))}
        </div>
      </div>

       <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Watch Later</h3>
        <div className="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {ytVideo.slice(4, 6).map((video, index) => (
            <YoutubeVideoCard key={index} video={video} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
