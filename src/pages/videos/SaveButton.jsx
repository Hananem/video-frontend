import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookmarkSimple } from 'phosphor-react';  // Import the icon
import {  toggleSaveVideo } from '../../redux/authSlice'; // Import the actions

const SaveButton = ({ videoId }) => {
  const dispatch = useDispatch();
  const { savedVideos } = useSelector((state) => state.auth.user.user); // Access savedVideos from Redux
  const { user } = useSelector((state) => state.auth); // Get user data from Redux
console.log(user)
  const isSaved = savedVideos.includes(videoId); // Check if the video is saved

  const handleSaveToggle = () => {
    // Use the user ID from Redux instead of passing as prop
    dispatch(toggleSaveVideo({ videoId }));
  };

  return (
    <button
      onClick={handleSaveToggle}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
    >
      {/* Icon color will change based on whether the video is saved */}
      <BookmarkSimple size={32} color={isSaved ? 'red' : 'gray'} />
      <span className="text-gray-800 font-medium">Save</span>
    </button>
  );
};

export default SaveButton;
