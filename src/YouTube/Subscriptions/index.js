import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionsAction } from "../actions/youTubeActions";
import { Bell } from "phosphor-react";

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading } = useSelector((state) => state.youTubeState);

  useEffect(() => {
    // Using a default channel ID for demo
    dispatch(getSubscriptionsAction("UC_x5XG1OV2P6uYZ5FHSUvNg"));
  }, [dispatch]);

  if (loading && !subscriptions.length) {
    return (
      <div className="p-8 flex flex-col gap-4 md:pl-[242px]">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-gray-800 rounded w-48"></div>
              <div className="h-3 bg-gray-800 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-900 h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">All Subscriptions</h1>
        <div className="flex gap-4">
          <button className="text-blue-400 font-medium hover:bg-blue-400/10 px-4 py-2 rounded-lg transition-colors">
            Manage
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <div 
            key={subscription.id} 
            className="flex items-center justify-between bg-gray-800/30 p-4 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-700 group-hover:ring-red-500 transition-all">
                <img 
                  src={subscription.snippet.thumbnails.default.url} 
                  alt={subscription.snippet.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-medium group-hover:text-red-400 transition-colors">
                  {subscription.snippet.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {subscription.contentDetails.newItemCount > 0 
                    ? `${subscription.contentDetails.newItemCount} new videos` 
                    : "No new activity"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all">
                <Bell size={20} weight="regular" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
