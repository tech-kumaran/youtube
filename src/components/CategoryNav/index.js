import React, { useRef, useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, setSelectedCategory } from "../../YouTube/Slices/youTubeSlice";
import { getYouTubeVideoAction } from "../../YouTube/actions/youTubeActions";
import { selectTags } from "../../YouTube/MainContainer/data";

const CategoryNav = ({ onCategoryClick }) => {
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory, videoCategories } = useSelector((state) => state.youTubeState);
  
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleTagClick = (tag) => {
    if (tag.categoryId) {
      dispatch(setSearchQuery(""));
      dispatch(setSelectedCategory(tag.categoryId));
    } else {
      dispatch(setSearchQuery(tag.label));
      dispatch(setSelectedCategory("All"));
    }
    
    // Trigger video fetch
    dispatch(getYouTubeVideoAction);
    
    if (onCategoryClick) {
      onCategoryClick(tag);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-900 sticky top-0 z-20 transition-colors duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center px-4 sm:px-6 py-3 gap-3">
        <div className="w-full relative flex items-center gap-2">
          {/* Left Scroll Button */}
          {showLeftButton && (
            <button
              onClick={() => scroll('left')}
              className="hidden sm:flex absolute left-0 z-10 bg-gradient-to-r from-white via-white dark:from-gray-900 dark:via-gray-900 to-transparent w-20 h-full items-center justify-start hover:opacity-80 transition-opacity"
              aria-label="Scroll left"
            >
              <div className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-1.5">
                <CaretLeft size={20} weight="bold" className="text-black dark:text-white" />
              </div>
            </button>
          )}

          {/* Scrollable Tags Container */}
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {(videoCategories?.length > 0 ? [{ id: "all", snippet: { title: "Recommended" } }, ...videoCategories] : selectTags).map((category, index) => {
                const label = category.snippet?.title || category.label;
                const isApiCategory = !!category.snippet;
                const tagObj = isApiCategory ? {
                  label: label,
                  categoryId: category.id === "all" ? "All" : category.id
                } : category;

                const isActive = 
                  (tagObj.categoryId && tagObj.categoryId === selectedCategory) || 
                  (!tagObj.categoryId && tagObj.label === searchQuery) ||
                  (selectedCategory === "All" && tagObj.categoryId === "All" && searchQuery === "");

                return (
                  <div
                    key={index}
                    className={`whitespace-nowrap text-xs sm:text-sm py-1.5 px-3 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white"
                    }`}
                    onClick={() => handleTagClick(tagObj)}
                  >
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Scroll Button */}
          {showRightButton && (
            <button
              onClick={() => scroll('right')}
              className="hidden sm:flex absolute right-0 z-10 bg-gradient-to-l from-white via-white dark:from-gray-900 dark:via-gray-900 to-transparent w-20 h-full items-center justify-end hover:opacity-80 transition-opacity"
              aria-label="Scroll right"
            >
              <div className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-1.5">
                <CaretRight size={20} weight="bold" className="text-black dark:text-white" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
