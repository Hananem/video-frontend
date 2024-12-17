import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { fetchVideosByUser } from '../../redux/videoSlice';

const VideosByUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  
  // Use useParams to get the userId from the URL
  const { userId } = useParams();

  // Access videosByUser, loading, and error states from Redux
  const { videosByUser, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    if (userId) {
      dispatch(fetchVideosByUser(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <p className="text-center text-gray-500">Loading videos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videosByUser.length > 0 ? (
          videosByUser.map((video) => (
            <div key={video._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 truncate">{video.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{video.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/update-video/${video._id}`)} // Navigate to UpdateVideo
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default VideosByUser;

