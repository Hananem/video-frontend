// src/components/UpdateProfile.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from '../../redux/profileSlice';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the user ID from the URL

  // Get the user data from Redux state
  const { user, status, error } = useSelector((state) => state.profile);

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');

  // Fetch user profile when the component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id)); // Fetch user profile from server
    }
  }, [dispatch, id]);

  // Set form state when user data is available
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]); // Re-run this when user data changes

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const profileData = {
      username,
      email,
      bio,
      password,
    };

    // Dispatch the update profile action
    dispatch(updateUserProfile(profileData))
      .unwrap()
      .then(() => {
        navigate('/profile'); // Redirect to profile page after update
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
      });
  };

  // Show loading state while fetching user profile
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // Show error if there is any issue fetching the user data
  if (status === 'failed') {
    return <p>{error || 'Failed to fetch user profile'}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="bio" className="text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
            rows="5"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
