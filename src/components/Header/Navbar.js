import React, { useState, useRef, useEffect } from "react";
import { List, VideoCamera, Bell, MagnifyingGlass, Moon, Sun, SignOut } from "phosphor-react";
import Search from "../Search/Search";
import Avatar from "react-avatar";
import Logo from "../../assets/logo";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../YouTube/Slices/youTubeSlice";

const Navbar = ({ setShowSidebar }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.youTubeState.isDarkMode);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 w-full h-14 flex justify-between items-center px-2 sm:px-4 border-b dark:border-gray-700 border-gray-200 transition-colors duration-300 fixed top-0 z-50">
      {/* Left Section - Logo and Menu */}
      <div className="flex gap-3 sm:gap-6 items-center min-w-fit">
        <div
          className="hover:bg-gray-200 dark:hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          onClick={() => {
            setShowSidebar();
          }}
        >
          <List className="text-black dark:text-white" size={24} weight="bold" />
        </div>
        <a href="/" className="flex items-center gap-1" title="YouTube Home">
           <div className="flex items-center">
            <Logo className="text-black dark:text-white h-5 w-auto" />
           </div>
        </a>
      </div>

      {/* Center Section - Search */}
      <div className={`${showMobileSearch ? 'flex absolute inset-0 bg-white dark:bg-gray-900 z-50 px-2' : 'hidden md:flex background-transparent'} flex-1 justify-center items-center`}>
        {showMobileSearch && (
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-black dark:text-white mr-2"
          >
            ← Back
          </button>
        )}
        <Search />
      </div>

      {/* Right Section - Icons */}
      <div className="flex justify-end gap-3 sm:gap-6 items-center min-w-fit relative">
        <button
          className="md:hidden text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          onClick={() => setShowMobileSearch(true)}
        >
          <MagnifyingGlass size={24} weight="bold" />
        </button>
        <VideoCamera className="text-black dark:text-white cursor-pointer hover:opacity-80 hidden sm:block" size={28} weight="regular" />
        <Bell className="text-black dark:text-white cursor-pointer hover:opacity-80 hidden sm:block" size={28} weight="regular" />
        
        {/* Profile Dropdown Trigger */}
        <div ref={dropdownRef}>
            <div onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <Avatar name="User" size="32" round={true} className="cursor-pointer" />
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
                <div className="absolute right-0 top-12 w-[300px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-3 items-center">
                        <Avatar name="User" size="40" round={true} />
                        <div>
                            <p className="text-black dark:text-white font-semibold">User Name</p>
                            <p className="text-black dark:text-white text-sm">@userhandle</p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                         {/* Appearance Toggle */}
                         <div 
                           className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between group"
                           onClick={() => dispatch(toggleTheme())}
                        >
                            <div className="flex items-center gap-4">
                                {isDarkMode ? <Moon size={24} className="text-black dark:text-white" /> : <Sun size={24} className="text-black dark:text-white" />}
                                <span className="text-black dark:text-white text-sm">Appearance: {isDarkMode ? "Dark" : "Light"}</span>
                            </div>
                            <span className="text-black dark:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Change</span>
                         </div>

                         {/* Mock Sign Out */}
                         <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-4">
                             <SignOut size={24} className="text-black dark:text-white" />
                             <span className="text-black dark:text-white text-sm">Sign out</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
