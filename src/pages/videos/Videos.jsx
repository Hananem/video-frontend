import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVideos } from '../../redux/videoSlice';
import { Link } from 'react-router-dom';
import  Categories from "../category/Categories"
import DateDisplay from "./DateDisplay"

const Videos = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(getAllVideos());
  }, [dispatch]);

  return (
    <div className="videos-container max-w-6xl mx-auto px-4 py-6">
    <Categories/>
      <h1 className="text-2xl font-bold mb-6">All Videos</h1>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-lg font-semibold text-gray-700">Loading...</p>}
      {error && <p className="text-center text-red-500">{error.message || 'An error occurred.'}</p>}

      {/* Video List */}
      <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos?.map((video) => (
          <div key={video._id} className="bg-deepPurple rounded-md overflow-hidden shadow-md ">
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
                      src={video.user.profilePhoto.url} // Profile photo URL
                      alt={video.user.username}
                      className="w-14 h-14 rounded-full "
                    />
                  </div>

                  {/* Duration (Positioned at bottom-right like YouTube) */}
                  <div className="absolute top-2 right-2  text-white text-xs px-2 py-1 rounded-md"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <span>
                      {video.duration
                        ? `${Math.floor(video.duration / 60)}m ${Math.round(video.duration % 60)}s`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Video Details */}
            <div className="p-4  ">
             <p>{video?.user?.username}</p>

              <Link to={`/videos/${video._id}`}>
                <h2 className="text-lg font-semibold ">{video.title}</h2>
              </Link>
              {/* Metadata: Duration and Views */}
              <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <DateDisplay  date={video.createdAt} />
                <span>{video.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
