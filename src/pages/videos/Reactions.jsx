import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleReaction } from '../../redux/videoSlice';

const reactionsList = [
  { label: 'Like', emoji: '👍', color: 'text-blue-500', type: 'like' },
  { label: 'Love', emoji: '❤️', color: 'text-red-500', type: 'love' },
  { label: 'Haha', emoji: '😂', color: 'text-yellow-500', type: 'haha' },
  { label: 'Angry', emoji: '😡', color: 'text-orange-500', type: 'angry' },
];

const Reactions = ({ videoId }) => {
  const dispatch = useDispatch();
  const { currentVideo } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth); // Assuming user contains current user details

  // Identify the current user's reaction
  const currentUserReaction = currentVideo?.reactions?.find(
    (reaction) => reaction.userId.includes(user.id)
  );

  const handleReaction = (type) => {
    // Toggle the selected reaction
    dispatch(toggleReaction({ videoId, type }));
  };

  return (
    <div className="reactions flex gap-4 mt-6">
      {reactionsList.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => handleReaction(reaction.type)}
          className={`flex items-center gap-2 p-2 rounded-full transition-transform transform hover:scale-110 ${
            currentUserReaction?.type === reaction.type
              ? reaction.color
              : 'text-gray-400'
          }`}
        >
          <span className="text-2xl">{reaction.emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default Reactions;
