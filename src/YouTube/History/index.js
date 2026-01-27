import React from 'react';
import { ytVideo } from "../MainContainer/data";
import YoutubeVideoCard from "../../components/YoutubeVideoCard";

const History = () => {
  return (
    <div className="p-6 h-[calc(100vh-56px)] overflow-y-auto text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Watch History</h2>
      <div className="grid gap-y-8 gap-x-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
        {ytVideo.map((video, index) => (
          <YoutubeVideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
};

export default History;
