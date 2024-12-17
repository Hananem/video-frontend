import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/profileSlice'; // Replace with the actual path of your action
import { Link, useParams } from 'react-router-dom';
import DateDisplay from './DateDisplay'; // Import the DateDisplay component

const WatchedVideos = () => {
  const { id } = useParams(); // Extract id from URL params
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id));
    }
  }, [dispatch, id]);

  // Get the watchedVideos list from the Redux state
  const watchedVideos = useSelector((state) => state.profile.user.watchedVideos);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Watched Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {watchedVideos && watchedVideos.length > 0 ? (
          watchedVideos.map((entry) => {
            // Check if video is not null
            const video = entry.video;
            if (video) {
              return (
                <div key={entry._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/video/${video._id}`} className="relative block text-center">
                    {/* Thumbnail Image */}
                    <img
                      src={video.thumbnailUrl}
                      alt={`${video.title}'s thumbnail`}
                      className="w-full h-40 object-cover"
                    />

                    {/* Duration Badge */}
                    <div
                      className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-md"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                    >
                      <span>
                        {video.duration
                          ? `${Math.floor(video.duration / 60)}m ${Math.round(video.duration % 60)}s`
                          : 'N/A'}
                      </span>
                    </div>

                    {/* Video Info */}
                    <h3 className="text-lg font-medium mt-4">{video.title}</h3>
                    <div className="text-gray-500 text-sm mt-2">
                      <span>{video.views} views</span>
                    </div>
                  </Link>

                  {/* Last Watched Timestamp */}
                  <div className="mt-2 text-gray-400 text-xs">
                    <span>Last watched: </span>
                    <DateDisplay date={entry.lastWatchedAt} />
                  </div>
                </div>
              );
            }
            return null; // Skip if video is null
          })
        ) : (
          <p className="text-gray-500">No watched videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default WatchedVideos;
