import React, { useState } from "react";
import { MagnifyingGlass, Microphone } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../YouTube/Slices/youTubeSlice";
import { getYouTubeVideoAction } from "../../YouTube/actions/youTubeActions";

const Search = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.youTubeState);
  const [inputValue, setInputValue] = useState(searchQuery);

  React.useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    dispatch(setSearchQuery(inputValue));
    dispatch(getYouTubeVideoAction);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-4 w-full justify-center items-center">
      <div className="flex w-full max-w-[642px]">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-black dark:text-white h-9 sm:h-10 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 sm:px-4 py-2 rounded-l-3xl focus:border-blue-500 outline-none text-sm sm:text-base transition-colors"
          placeholder="Search"
        />
        <button
          onClick={handleSearch}
          className="w-12 sm:w-16 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 flex justify-center items-center rounded-r-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <MagnifyingGlass className="text-black dark:text-white" size={24} weight="light" />
        </button>
      </div>
      <div className="hidden sm:flex w-9 sm:w-10 h-9 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-full justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Microphone className="text-black dark:text-white" size={24} weight="fill" />
      </div>
    </div>
  );
};

export default Search;
