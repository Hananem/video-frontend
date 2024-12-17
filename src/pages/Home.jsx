// Home.jsx
import React from "react";
import LatestVideos from "../components/videos/LatestVideos";  // Import LatestVideos
import SuggestedVideos from "../components/videos/SuggestedVideos";  // Import SuggestedVideos
import FollowedUsersVideos from "../components/videos/FollowedUsersVideos";  // Import FollowedUsersVideos
import Banner from "../images/banner.png"

const Home = () => {
  return (
    <div>
 <div className="relative">
      {/* Banner Image */}
      <img
        src={ Banner}
        alt="Banner"
        className="w-full h-[400px] object-cover"
      />

      {/* Glass Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-30 backdrop-blur-md">
        {/* Content on the Banner */}
        <div className="relative z-10 text-white p-8">
          <h1 className="text-4xl font-bold">Welcome to Our Video Platform</h1>
          <p className="mt-2 text-lg">Discover amazing content</p>
        </div>
      </div>
    </div>      
      {/* Display the components */}
      <LatestVideos /> {/* Latest videos slider */}
      <SuggestedVideos /> {/* Suggested videos section */}
      <FollowedUsersVideos /> {/* Videos from followed users */}

    </div>
  );
};

export default Home;


