import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../redux/profileSlice'; // Replace with the actual path of your action
import { removeFollowing } from '../../redux/authSlice'; // Import the removeFollowing action
import { Link, useParams } from 'react-router-dom';

const Following = () => {
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
  }, [dispatch, id]);

  const handleRemoveFollowing = (followingId) => {
    // Dispatch removeFollowing action with the following ID
    dispatch(removeFollowing(followingId));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Following</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {user?.following?.length > 0 ? (
          user.following.map((followingUser) => (
            <div key={followingUser._id} className=" w-[100px]  border border-white rounded-lg shadow-md overflow-hidden p-4">
              <Link to={`/profile/${followingUser._id}`} className="block text-center">
                <img
                  src={followingUser?.profilePhoto?.url}
                  alt={`${followingUser.username}'s profile`}
                  className="w-18 h-18 mx-auto mt-4 rounded-full object-cover"
                />
                <h3 className="text-lg font-medium mt-4">{followingUser.username}</h3>
              </Link>
              {/* Remove Following Button */}
              {userId !== followingUser._id && ( // Prevent the current user from removing themselves
                <button
                  onClick={() => handleRemoveFollowing(followingUser._id)}
                  className="btn btn-primary"
                >
                  Remove 
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users to follow yet.</p>
        )}
      </div>
    </div>
  );
};

export default Following;

