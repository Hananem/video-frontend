import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CaretRight, CaretLeft } from "phosphor-react";
import { getFollowedUsersVideos } from "../../redux/authSlice";
import DateDisplay from "../../pages/videos/DateDisplay";

const FollowedUsersVideos = () => {
  const dispatch = useDispatch();
  const { followedUsersVideos, loading, error } = useSelector((state) => state.auth); // Access from auth state
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getFollowedUsersVideos()); // Fetch followed users' videos
  }, [dispatch]);

  // Handle navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? followedUsersVideos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === followedUsersVideos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Followed Users' Videos</h2>
      </div>

      {/* Video Slider */}
      <div className="relative">
        {loading && <p className="text-center text-gray-500">Loading videos...</p>}
        {error && (
          <p className="text-center text-red-500">
            Error fetching videos: {error}
          </p>
        )}
        {followedUsersVideos?.length > 0 && (
          <div className="overflow-hidden">
            {/* Videos */}
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${followedUsersVideos.length * 100}%`,
              }}
            >
              {followedUsersVideos.map((video) => (
                <div
                  key={video._id}
                  className="flex-shrink-0 w-full md:w-1/3 px-2"
                  style={{ flex: "0 0 100%" }}
                >
                  {/* Video Card */}
                  <div className="bg-deepPurple rounded-md overflow-hidden shadow-md">
                    {/* Thumbnail */}
                    {video.thumbnailUrl && (
                      <Link to={`/videos/${video._id}`}>
                        <div className="relative">
                          <img
                            src={video.thumbnailUrl}
                            alt="Video Thumbnail"
                            className="w-full h-48 object-cover"
                          />

                          {/* Profile Photo */}
                          <div className="absolute bottom-0 left-[73%] transform -translate-x-1/3 translate-y-1/2">
                            <img
                              src={video.user.profilePhoto.url}
                              alt={video.user.username}
                              className="w-14 h-14 rounded-full"
                            />
                          </div>

                          {/* Duration */}
                          <div
                            className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-md"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                          >
                            <span>
                              {video.duration
                                ? `${Math.floor(video.duration / 60)}m ${Math.round(
                                    video.duration % 60
                                  )}s`
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}

                    {/* Video Details */}
                    <div className="p-4">
                      <p>{video?.user?.username}</p>
                      <Link to={`/videos/${video._id}`}>
                        <h2 className="text-lg font-semibold">{video.title}</h2>
                      </Link>
                      {/* Metadata */}
                      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                        <DateDisplay date={video.createdAt} />
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && !error && (!followedUsersVideos || followedUsersVideos.length === 0) && (
          <p className="text-center text-gray-500">No videos from followed users available</p>
        )}

        {/* Navigation Buttons */}
        {followedUsersVideos?.length > 0 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
            >
              <CaretLeft size={32} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
            >
              <CaretRight size={32} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FollowedUsersVideos;
