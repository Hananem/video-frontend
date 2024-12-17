import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/profileSlice';
import { removeFollower } from '../../redux/authSlice'; // Replace with the actual path of your action
import { Link, useParams } from 'react-router-dom';

const Followers = () => {
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

  const handleRemoveFollower = (followerId) => {
    // Dispatch removeFollower action with the follower ID
    dispatch(removeFollower(followerId));
  };
  return (
<div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Followers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {user?.followers?.length > 0 ? (
          user.followers.map((follower) => (
            <div key={follower._id} className="w-[100px]  border border-white rounded-lg shadow-md overflow-hidden p-4">
              <Link to={`/profile/${follower._id}`} className="block text-center">
                <img
                  src={follower?.profilePhoto?.url}
                  alt={`${follower.username}'s profile`}
                  className="w-18 h-18 mx-auto mt-4 rounded-full object-cover"
                />
                <h3 className="text-lg font-medium mt-4">{follower.username}</h3>
              </Link>
              {/* Remove Follower Button */}
              {userId !== follower._id && ( // Prevent the current user from removing themselves
                <button
                  onClick={() => handleRemoveFollower(follower._id)}
                  className="btn btn-primary"
                >
                  Remove 
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No Followers.</p>
        )}
      </div>
    </div>
  );
};

export default Followers;
