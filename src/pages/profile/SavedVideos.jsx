import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/profileSlice'; // Adjust the path as needed
import { useParams } from 'react-router-dom';


const SavedVideos = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Extract user ID from auth state
  const userId = useSelector((state) => state.auth?.user?._id);

  // Extract user, loading, and error from profile slice
  const { user, loading, error } = useSelector((state) => state.profile);

  // Fetch user profile if userId exists
  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id));
    }
  }, [dispatch, userId]);

  // Show loading or error messages if applicable
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Saved Videos</h2>

      {user?.savedVideos && user.savedVideos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold">Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {user.savedVideos.map((video) => (
              <div key={video._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="mt-4 text-xl font-semibold">{video.title}</h3>
                <p className="text-gray-200">{video.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!user?.savedVideos?.length && (
        <p className="text-gray-500">No saved videos yet.</p>
      )}
    </div>
  );
};

export default SavedVideos;
