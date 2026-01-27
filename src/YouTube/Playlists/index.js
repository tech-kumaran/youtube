import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylistsAction } from "../actions/youTubeActions";
import { List } from "phosphor-react";

const Playlists = () => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.youTubeState);

  useEffect(() => {
    // Using a default channel ID for demo if none selected
    dispatch(getPlaylistsAction("UC_x5XG1OV2P6uYZ5FHSUvNg")); 
  }, [dispatch]);

  if (loading && !playlists.length) {
    return (
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:pl-[242px]">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="aspect-video bg-gray-800 rounded-xl"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:pl-[242px] bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
              <img 
                src={playlist.snippet.thumbnails.medium.url} 
                alt={playlist.snippet.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <span className="text-lg font-bold">{playlist.contentDetails.itemCount}</span>
                <List size={20} weight="bold" />
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold">
                  View Playlist
                </div>
              </div>
            </div>
            <h3 className="text-white font-medium line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
              {playlist.snippet.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{playlist.snippet.channelTitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
