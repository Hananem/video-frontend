import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { globalSearch } from '../redux/videoSlice';

const SearchResults = () => {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const query = queryParams.get('query');

  const { results, loading, error } = useSelector((state) => state.videos);
console.log(results)
  useEffect(() => {
    if (query) {
      dispatch(globalSearch(query));
    }
  }, [dispatch, query]);

  if (!query) {
    return <p className="text-center mt-4">Please enter a search query.</p>;
  }

  return (
    <div className="search-results">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="results">
        <h3 className="text-xl font-bold">Users</h3>
        {results?.users?.length > 0 ? (
          results?.users?.map((user) => (
            <div key={user?._id} className="user-card  p-4 rounded mb-2">
              <img
                src={user?.profilePhoto.url}
                alt={user?.username}
                className="w-12 h-12 rounded-full inline-block mr-4"
              />
              <div className="inline-block align-middle">
                <p className="font-semibold">{user?.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}

        <h3 className="text-xl font-bold mt-4">Videos</h3>
        {results?.videos?.length > 0 ? (
          results?.videos?.map((video) => (
            <div key={video?._id} className=" p-4 rounded mb-2">
            <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt="Video Thumbnail"
                    className="w-full h-48 object-cover"
                  />

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
              <div className="inline-block align-middle">
                <p className="font-semibold">{video?.title}</p>
                <p className="text-gray-500">{video?.description}</p>
                <span>{video.views} views</span>
              </div>
            </div>
          ))
        ) : (
          <p>No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
