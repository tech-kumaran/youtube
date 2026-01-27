import { Routes, Route } from "react-router-dom";

import YouTubeApp from "./YouTube";
import YouTubeVideo from "./YouTube/YoutubeVideoView";
import { useSelector } from "react-redux";

function App() {
  const isDarkMode = useSelector((state) => state.youTubeState.isDarkMode);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<YouTubeApp />} />
          <Route exact path="/watch" element={<YouTubeVideo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
