import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../../redux/authSlice'; // Replace with the correct path to your slice
import { fetchFollowers } from '../../redux/authSlice'; // To refresh followers count

const FollowButton = ({ targetUserId }) => {
  const dispatch = useDispatch();
  const {  following } = useSelector((state) => state.auth.user.user); // Replace 'auth' with your actual state slice
  const {  savedVideos } = useSelector((state) => state.auth.user.user); // Replace 'auth' with your actual state slice
console.log(following)
console.log(savedVideos)
  // Determine if the current user is following the target user
  const isFollowing = following?.includes(targetUserId);

  const handleFollow = () => {
     dispatch(followUser( targetUserId ));
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded ${
        isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;

