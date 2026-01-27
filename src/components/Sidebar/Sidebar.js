import React, { useState } from "react";
import { 
  House,
  PlayCircle,
  YoutubeLogo,
  ClockCounterClockwise,
  Clock,
  ThumbsUp,
  TrendUp,
  ShoppingBag,
  MusicNotes,
  FilmSlate,
  Broadcast,
  GameController,
  Newspaper,
  GraduationCap,
  TShirt,
  Gear,
  Flag,
  Question,
  ChatCenteredDots,
  Stack
} from "phosphor-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../../assets/logo";

const Sidebar = ({ showSidebar, activeView, onViewChange, onClose, isOverlayMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.youTubeState.isDarkMode);
  const [active, setActive] = useState(activeView || "Home");

  const handleSectionClick = (label) => {
    setActive(label);
    
    // If we are not on the home page, navigate back to home with the view state
    if (location.pathname !== "/") {
      navigate("/", { state: { view: label } });
      if (onClose) onClose();
      return;
    }

    if (onViewChange) {
      onViewChange(label);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const youTubeTopSection = [
    { icon: House, label: "Home" },
    { icon: PlayCircle, label: "Shorts" },
    { icon: YoutubeLogo, label: "Subscriptions" },
  ];

  const youTubeTopSectionSecond = [
    { icon: Stack, label: "Library" },
    { icon: ClockCounterClockwise, label: "History" },
    { icon: Clock, label: "Watch Later" },
    { icon: ThumbsUp, label: "Liked Videos" },
  ];

  const youTubeExploreSection = [
    { icon: TrendUp, label: "Trending" },
    { icon: ShoppingBag, label: "Shopping" },
    { icon: MusicNotes, label: "Music" },
    { icon: FilmSlate, label: "Movies" },
    { icon: Broadcast, label: "Live" },
    { icon: GameController, label: "Gaming" },
    { icon: Newspaper, label: "News" },
    { icon: GameController, label: "Sports" },
    { icon: GraduationCap, label: "Learning" },
    { icon: TShirt, label: "Fashion & Beauty" },
  ];

  const moreFromYouTube = [
    { icon: YoutubeLogo, label: "YouTube Premium", color: "text-red-600" },
    { icon: MusicNotes, label: "YouTube Music", color: "text-red-600" },
    { icon: PlayCircle, label: "YouTube Kids", color: "text-red-600" },
  ];

  const YouTubeBottomSection = [
    { icon: Gear, label: "Settings" },
    { icon: Flag, label: "Report History" },
    { icon: Question, label: "Help" },
    { icon: ChatCenteredDots, label: "Send feedback" },
  ];

  const footerSectionTop = [
    { label: "About", link: "#" },
    { label: "Press", link: "#" },
    { label: "Copyright", link: "#" },
    { label: "Contact us", link: "#" },
    { label: "Creators", link: "#" },
    { label: "Advertise", link: "#" },
    { label: "Developers", link: "#" },
  ];

  const footerSectionBottom = [
    { label: "Terms", link: "#" },
    { label: "Privacy Policy & Safety", link: "#" },
    { label: "How YouTube works", link: "#" },
    { label: "Test new features", link: "#" },
  ];

  const miniSidebarIcons = [
    { icon: House, label: "Home" },
    { icon: PlayCircle, label: "Shorts" },
    { icon: YoutubeLogo, label: "Subscriptions" },
    { icon: Stack, label: "Library" },
  ];

  function SidebarSection({ items, label }) {
    return (
      <>
        <div className="m-2">
          {label && (
            <h6 className="text-md text-black dark:text-white pl-3 p-[4px]">{label}</h6>
          )}
          {items.map((item, index) => {
            const isActive = item.label === active;
            const Icon = item.icon;
            return (
              <div
                onClick={() => handleSectionClick(item.label)}
                key={index}
                className={`text-sm leading-[174%] flex items-center gap-6 p-2 pl-3 rounded-[10px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-100 dark:bg-gray-600 font-medium" : "text-black dark:text-white"
                } ${isActive ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
              >
                <Icon 
                  size={24} 
                  weight={isActive ? "fill" : "regular"} 
                  className={item.color || (isActive ? 'text-black dark:text-white' : 'text-gray-900 dark:text-gray-300')}
                />
                <span className={isActive ? "text-black dark:text-white" : "text-gray-900 dark:text-gray-100"}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 border-solid"></div>
      </>
    );
  }

  function FooterSection({ items }) {
    return (
      <ul className="px-3 flex flex-wrap text-[13px] pt-[12px]">
        {items.map((footer, index) => (
          <a href={footer.link} key={index}>
            <li className="mr-2 hover:underline cursor-pointer text-gray-600 dark:text-gray-400">{footer.label}</li>
          </a>
        ))}
      </ul>
    );
  }

  function MiniSidebar({ items }) {
    return (
      <ul className="px-1 flex flex-wrap text-[13px] pt-[12px]">
        {items.map((item, index) => {
          const isActive = item.label === active;
          const Icon = item.icon;
          return (
            <div
              onClick={() => handleSectionClick(item.label)}
              key={index}
              className={`text-sm w-[74px] flex flex-col items-center py-4 rounded-[10px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                isActive ? "bg-gray-100 dark:bg-gray-600" : "text-black dark:text-white"
              }`}
            >
              <Icon 
                size={24} 
                weight={isActive ? "fill" : "regular"} 
                className={isActive ? 'text-black dark:text-white mb-1' : 'text-gray-900 dark:text-gray-300 mb-1'}
              />
              <span className={`text-[10px] ${isActive ? "text-black dark:text-white" : "text-gray-900 dark:text-gray-100"}`}>{item.label}</span>
            </div>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      {/* Modal Sidebar Overlay/Backdrop (Mobile + Watch Page) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          // If overlay mode, show on all screens. If not, only show on mobile (md:hidden)
          isOverlayMode ? "" : "md:hidden"
        } ${
          showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose && onClose()}
      />

      {/* Modal Sliding Sidebar (Mobile + Watch Page) */}
      <div className={`fixed top-0 left-0 bottom-0 w-[240px] bg-white dark:bg-gray-900 z-50 transition-transform duration-300 transform ${
        // If overlay mode, show on all screens. If not, only show on mobile (md:hidden)
        isOverlayMode ? "" : "md:hidden"
      } ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      } custom-scrollbar overflow-y-auto border-r border-gray-200 dark:border-gray-800`}>
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 mb-2">
            <svg height="24" viewBox="0 0 95 20" fill="currentColor" className="text-black dark:text-white" xmlns="http://www.w3.org/2000/svg">
              {/* YouTube Icon */}
              <g>
               <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
               <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </g>
              {/* YouTube Text */}
              <g transform="translate(22, 21)">
                <path d="M3.23 15.39L0.59 5.86H2.96L4.08 10.96C4.37 12.24 4.58 13.33 4.7 14.21H4.78C4.89 13.38 5.12 12.26 5.42 10.96L6.58 5.86H8.86L6.15 15.39V22.46H3.84V15.39H3.23Z" fill="currentColor"/>
                <path d="M10.16 22.87C9.58 22.48 9.17 21.87 8.93 21.03C8.68 20.19 8.56 19.1 8.56 17.78V16.7C8.56 15.34 8.7 14.22 8.97 13.37C9.25 12.51 9.68 11.89 10.27 11.48C10.87 11.07 11.66 10.86 12.67 10.86C13.68 10.86 14.45 11.08 15.01 11.51C15.58 11.93 15.98 12.55 16.23 13.4C16.48 14.24 16.61 15.35 16.61 16.7V17.78C16.61 19.12 16.48 20.21 16.22 21.05C15.97 21.89 15.55 22.5 14.97 22.9C14.39 23.3 13.6 23.51 12.57 23.51C11.53 23.51 10.73 23.3 10.16 22.87ZM13.98 20.87C14.13 20.44 14.2 19.78 14.2 18.89V15.58C14.2 14.71 14.13 14.07 13.98 13.65C13.84 13.23 13.58 13.01 13.21 13.01C12.84 13.01 12.59 13.23 12.45 13.65C12.31 14.07 12.24 14.71 12.24 15.58V18.89C12.24 19.79 12.31 20.45 12.45 20.87C12.6 21.28 12.85 21.49 13.21 21.49C13.59 21.49 13.84 21.28 13.98 20.87Z" fill="currentColor"/>
                <path d="M21.92 23.27C21.49 23.27 21.14 23.12 20.89 22.82C20.64 22.51 20.5 22.04 20.48 21.4H20.39L20.19 23.27H18.28V11.13H20.62V20.14C20.62 20.67 20.72 21.03 20.92 21.23C21.12 21.43 21.37 21.53 21.72 21.53C22.04 21.53 22.33 21.43 22.58 21.23C22.83 21.03 22.99 20.73 23.08 20.35V11.13H25.42V23.27H23.19V22.25H23.11C22.85 22.93 22.45 23.27 21.92 23.27Z" fill="currentColor"/>
                <path d="M30.64 5.86H33.02V23.27H30.64V5.86ZM30.43 2.15C30.43 1.45 30.68 1.1 31.18 1.1C31.69 1.1 31.94 1.45 31.94 2.15C31.94 2.87 31.69 3.23 31.18 3.23C30.68 3.23 30.43 2.87 30.43 2.15Z" fill="currentColor"/>
                <path d="M38.83 23.27C38.38 23.27 38.01 23.12 37.75 22.82C37.5 22.51 37.36 22.04 37.34 21.4H37.25L37.05 23.27H35.14V11.13H37.48V20.14C37.48 20.67 37.58 21.03 37.78 21.23C37.98 21.43 38.23 21.53 38.58 21.53C38.9 21.53 39.19 21.43 39.44 21.23C39.69 21.03 39.85 20.73 39.94 20.35V11.13H42.27V23.27H40.05V22.25H39.97C39.71 22.93 39.31 23.27 38.83 23.27Z" fill="currentColor"/>
                <path d="M48.74 15.2C48.74 13.9 48.68 12.98 48.56 12.44C48.33 11.39 47.73 10.86 46.75 10.86C46.33 10.86 45.93 10.98 45.57 11.23C45.22 11.47 44.93 11.8 44.72 12.2V11.13H42.54V23.27H44.72V22.42H44.8C44.99 22.76 45.26 23.03 45.61 23.22C45.96 23.41 46.35 23.51 46.78 23.51C47.78 23.51 48.42 22.95 48.69 21.84C48.77 21.52 48.81 21.05 48.81 20.44V18.1H46.47V20.48C46.47 21.04 46.43 21.41 46.36 21.58C46.26 21.82 46.08 21.94 45.82 21.94C45.62 21.94 45.44 21.85 45.29 21.66C45.14 21.47 45.06 21.15 45.06 20.71V12.35C45.06 12.08 45.13 11.86 45.27 11.69C45.41 11.51 45.59 11.42 45.81 11.42C46.06 11.42 46.25 11.53 46.36 11.77C46.44 11.93 46.48 12.27 46.48 12.79V15.2H48.74Z" fill="currentColor"/>
                <path d="M52.3 19.34C52.12 19.53 51.98 19.63 51.75 19.63C51.52 19.63 51.34 19.54 51.22 19.34C51.1 19.14 51.04 18.8 51.04 18.32V14.94C51.04 14.47 51.1 14.15 51.21 13.95C51.32 13.76 51.5 13.66 51.74 13.66C51.98 13.66 52.17 13.76 52.28 13.96C52.39 14.16 52.45 14.48 52.45 14.94V18.32C52.45 18.81 52.4 19.14 52.3 19.34ZM54.76 16.59C54.76 15.7 54.73 14.99 54.67 14.46C54.54 13.36 54.01 12.81 53.07 12.81C52.56 12.81 52.12 13 51.74 13.38L51.66 12.98H49.56V21.36H51.66V20.84H51.74C52.1 21.24 52.53 21.44 53.05 21.44C54.02 21.44 54.55 20.89 54.66 19.78C54.72 19.19 54.76 18.25 54.76 16.94V16.59Z" fill="currentColor"/>
              </g>
            </svg>
        </div>
        <SidebarSection items={youTubeTopSection} />
        <SidebarSection items={youTubeTopSectionSecond} />
        <SidebarSection items={youTubeExploreSection} label="Explore" />
        <SidebarSection items={moreFromYouTube} label="More from YouTube" />
        <SidebarSection items={YouTubeBottomSection} />
        <div className="p-2 text-gray-500 dark:text-gray-300">
          <FooterSection items={footerSectionTop} />
          <FooterSection items={footerSectionBottom} />
        </div>
        <div className="text-xs mx-6 my-4 text-gray-500 dark:text-gray-300">
          © 2024 Google LLC
        </div>
      </div>

      {/* Persistent Sidebar (Home Page Desktop) */}
      {!isOverlayMode && (
        <div className={`hidden md:block bg-white dark:bg-gray-900 h-full scroll-smooth custom-scrollbar overflow-y-auto fixed z-20 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 ${
          showSidebar ? "w-[72px] overflow-hidden" : "w-60"
        }`}>
          {showSidebar ? (
          <MiniSidebar items={miniSidebarIcons} />
        ) : (
          <>
            <SidebarSection items={youTubeTopSection} />
            <SidebarSection items={youTubeTopSectionSecond} />
            <SidebarSection items={youTubeExploreSection} label="Explore" />
            <SidebarSection items={moreFromYouTube} label="More from YouTube" />
            <SidebarSection items={YouTubeBottomSection} />
            <div className="p-2 text-gray-500 dark:text-gray-300">
              <FooterSection items={footerSectionTop} />
              <FooterSection items={footerSectionBottom} />
            </div>
            <div className="text-xs mx-6 my-4 text-gray-500 dark:text-gray-300">
              © 2024 Google LLC
            </div>
          </>
        )}
        </div>
      )}
    </>
  );
};



export default Sidebar;
