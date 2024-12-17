import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideoById, updateComment, deleteComment, addReply,toggleLikeComment,watchVideo,toggleReaction } from '../../redux/videoSlice'
import { useParams } from 'react-router-dom';
import AddComment from './AddComment';
import { BookmarkSimple } from 'phosphor-react';  // Import the icon
import {  toggleSaveVideo } from '../../redux/authSlice';
import { fetchUserProfile } from '../../redux/profileSlice'; // Import the actions
import { FaHeart,FaLaughSquint, FaRegLaughSquint } from "react-icons/fa";
import { FaRegFaceSadTear, FaRegHeart } from "react-icons/fa6";
import { ImAngry, ImAngry2 } from "react-icons/im";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
const VideoDetails = () => {
  const { id } = useParams();
  console.log(id) // Video ID from the URL
  const dispatch = useDispatch();
  const { currentVideo, loading, error } = useSelector((state) => state.videos);
  const reactions = currentVideo?.reactions;
  const { savedVideos } = useSelector((state) => state.auth.user.user)
  const [replyText, setReplyText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);
  const { token } = useSelector((state) => state.auth); 
  const { user } = useSelector((state) => state.auth.user);
  const userId = user?.id
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommentText, setEditCommentText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);

   // Check if the current video is already saved
   const isSaved = savedVideos?.includes(id);

   const ReactionIcons = {
    like: { default: <AiOutlineLike />, active: <AiFillLike color="blue" /> },
    love: { default: <FaRegHeart />, active: <FaHeart color="red" /> },
    haha: { default: <FaRegLaughSquint />, active: <FaLaughSquint color="yellow" /> },
    angry: { default: <ImAngry />, active: <ImAngry2 color="orange" /> },
    sad: { default: <FaRegFaceSadTear />, active: <FaRegFaceSadTear color="blue" /> },
  };

  const openEditModal = (commentId, text) => {
    setEditCommentId(commentId);
    setEditCommentText(text);
    setIsEditModalOpen(true);
  };

  const handleUpdateComment = async () => {
    if (editCommentText.trim()) {
      await dispatch(updateComment({ commentId: editCommentId, text: editCommentText }));
      setIsEditModalOpen(false);
    }
  };

  const handleLikeToggle = (commentId) => {
    dispatch(toggleLikeComment(commentId));
  };

  const handleReplySubmit = async (commentId) => {
    if (replyText.trim()) {
      await dispatch(addReply({ commentId, text: replyText })); // Dispatch the reply
      setReplyText(''); // Clear the input
      setActiveCommentId(null); // Close reply input
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await dispatch(deleteComment(commentId));
    }
  };

    // Toggle save/unsave action
    const handleSaveToggle = () => {
      console.log("Toggling save for videoId:", id);
      dispatch(toggleSaveVideo(id));
    };

      // Handle toggling a reaction
  const handleReactionToggle = (type) => {
    dispatch(toggleReaction({ videoId: id, type }));
  };

  // Fetch video details when the component mounts or ID changes
  useEffect(() => {
    dispatch(getVideoById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id)); // Fetch user profile including savedVideos
    }
  }, [dispatch, user?.id]);

  return (
    <div className="mx-auto px-4 py-6">
      {/* Loading or Error States */}
      {loading && (
        <p className="text-center text-lg font-semibold text-gray-700">Loading video details...</p>
      )}
      {error && (
        <p className="text-center text-red-500 font-medium">
          {error.message || 'An error occurred.'}
        </p>
      )}

      {/* Video Details */}
      {currentVideo && (
        <div className="mb-6">
  <video
    onPlay={() => dispatch(watchVideo(id))}  // Passing the id directly to dispatch
    controls
    className="w-full h-[500px] rounded-md"
  >
    <source
      src={currentVideo.videoUrl}
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
</div>
      )}

      <button
        onClick={handleSaveToggle}
        className="flex items-center space-x-2 px-4 py-2 mt-4 bg-gray-100 rounded hover:bg-gray-200"
      >
        <BookmarkSimple size={24} color={isSaved ? 'red' : 'gray'} />
        <span className="text-gray-800 font-medium">
          {isSaved ? 'Unsave' : 'Save'}
        </span>
      </button>

       {/* Reactions */}
     
       <div className="flex space-x-4 mt-4">
        {['like', 'love', 'haha', 'angry', 'sad'].map((type) => (
          <button
            key={type}
            onClick={() => handleReactionToggle(type)}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              reactions?.some((reaction) => reaction?.type === type)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            {reactions?.some((reaction) => reaction?.type === type)
              ? ReactionIcons[type].active
              : ReactionIcons[type].default} 
          </button>
        ))}
      </div>


          {/* Edit Comment Modal */}
          {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Edit Comment</h3>
            <textarea
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring"
              rows="4"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default VideoDetails;
