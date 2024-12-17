import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addComment } from '../../redux/videoSlice'; // Import the thunk

const AddComment = ({ videoId }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      await dispatch(addComment({ videoId, text: comment })); // Dispatch addComment
      setComment(''); // Clear the input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-[350px] p-2 border rounded-md focus:outline-none focus:ring"
        rows="3"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
      >
        Post Comment
      </button>
    </form>
  );
};

export default AddComment;

