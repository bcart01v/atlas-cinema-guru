"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ActivityFeed from "./ActivityFeed";

const DashboardSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refreshActivities = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <nav
      ref={sidebarRef}
      className={`relative bg-teal h-screen flex flex-col transition-all ease-in-out duration-300
        w-20 hover:w-64 md:w-20 overflow-y-auto`}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
      role="navigation"
      aria-label="Sidebar Navigation"
      aria-expanded={isExpanded}
    >
      {/* Navigation Links */}
      <div className="flex flex-col space-y-6 px-5 pt-5">
        <Link
          href="/"
          className="flex items-center focus:ring-2 focus:ring-midnightBlue-300"
          tabIndex={0}
          aria-label="Go to Home"
        >
          <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
          <span
            className={`ml-3 text-white transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
          >
            Home
          </span>
        </Link>

        <Link
          href="/favorites"
          className="flex items-center focus:ring-2 focus:ring-midnightBlue-300"
          tabIndex={0}
          aria-label="Go to Favorites"
        >
          <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
          <span
            className={`ml-3 text-white transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
          >
            Favorites
          </span>
        </Link>

        <Link
          href="/watch-later"
          className="flex items-center focus:ring-2 focus:ring-midnightBlue-300"
          tabIndex={0}
          aria-label="Go to Watch Later"
        >
          <img src="/assets/clock-solid.svg" alt="" className="h-6 w-6" />
          <span
            className={`ml-3 text-white transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
          >
            Watch Later
          </span>
        </Link>
      </div>

      {/* Activity Feed - Hidden when collapsed */}
      <div
        className={`flex-grow transition-all duration-300 ${isExpanded ? "px-4 overflow-y-auto" : "hidden"}`}
      >
        {isExpanded && <ActivityFeed refreshTrigger={refreshTrigger} />}
      </div>
    </nav>
  );
};

export default DashboardSidebar;
