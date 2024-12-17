import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile, uploadProfilePhoto, uploadBackgroundImage } from '../../redux/profileSlice';
import { useParams } from 'react-router-dom';
import { Camera } from 'phosphor-react';
import FollowButton from './FollowButton';


const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, loading, error } = useSelector((state) => state.profile);
  const fileInputRef = useRef(null); // Ref for the profile photo file input
  const backgroundInputRef = useRef(null); // Ref for the background image file input

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfile(id));
    }
  }, [dispatch, id]);

  const handleProfilePhotoClick = () => {
    fileInputRef.current.click(); // Trigger profile photo file input
  };

  const handleBackgroundImageClick = () => {
    backgroundInputRef.current.click(); // Trigger background image file input
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePhoto', file);

      dispatch(uploadProfilePhoto(formData))
        .unwrap()
        .then(() => {
          console.log('Profile photo uploaded successfully.');
        })
        .catch((err) => {
          console.error('Error uploading profile photo:', err);
        });
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('backgroundImage', file);

      dispatch(uploadBackgroundImage(formData))
        .unwrap()
        .then(() => {
          console.log('Background image uploaded successfully.');
        })
        .catch((err) => {
          console.error('Error uploading background image:', err);
        });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {user ? (
        <div>
          {/* Background Image */}
          <div className="relative h-64">
            <img
              src={user.backgroundImage?.url}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
              onClick={handleBackgroundImageClick}
            >
              <Camera size={32} />
            </div>

            {/* Profile Photo */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <img
                  src={user.profilePhoto?.url}
                  alt={`${user.username}'s profile`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                />
                <div
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
                  onClick={handleProfilePhotoClick}
                >
                  <Camera size={24} />
                </div>
                {/* Hidden file input for profile photo */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleProfilePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p>{user.bio || 'No bio available.'}</p>
          </div>

          {/* Followers and Following */}
          <div className="mt-8 flex justify-center space-x-10">
            <div className="text-center">
              <p className="text-lg font-bold">{user.followers?.length || 0}</p>
              <p>Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{user.following?.length || 0}</p>
              <p>Following</p>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <FollowButton targetUserId={id} user={user} /> {/* Pass profile ID to FollowButton */}
          </div>

             {/* Videos Section */}
          {user.videos && user.videos.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                {user.videos.map((video) => (
                  <div key={video._id} className=" p-4 rounded-lg shadow-md">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="mt-4 text-xl font-semibold">{video.title}</h3>
                    <p className="text-gray-200">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Hidden file input for background image */}
          <input
            type="file"
            accept="image/*"
            ref={backgroundInputRef}
            onChange={handleBackgroundImageChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p>No profile data available.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

