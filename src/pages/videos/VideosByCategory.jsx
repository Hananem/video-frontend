import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchVideosByCategory } from '../../redux/videoSlice'; // Adjust path as needed

const VideosByCategory = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { videosbycategory, loading, error } = useSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideosByCategory(categoryId));
  }, [dispatch, categoryId]);

  return (
    <div className="videos-by-category container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Videos</h2>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-red-500">{error.message || error.toString()}</p>}

      <div className="video-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videosbycategory && videosbycategory.length > 0 ? (
          videosbycategory.map((video) => (
            <div key={video._id} className="video-card shadow-md rounded-lg p-4">
              <img
                src={video.thumbnail?.url}
                alt={video.title}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{video.title}</h3>
            </div>
          ))
        ) : (
          !loading && <p>No videos found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default VideosByCategory;
