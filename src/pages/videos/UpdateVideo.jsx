import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoById, updateVideo, deleteVideo } from '../../redux/videoSlice';
import { fetchCategories } from '../../redux/categorySlice';

const UpdateVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentVideo } = useSelector((state) => state.videos);
  const { categories } = useSelector((state) => state.categories);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('public');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    if (videoId) {
      dispatch(getVideoById(videoId));
    }
  }, [dispatch, videoId]);

  useEffect(() => {
    if (currentVideo) {
      setTitle(currentVideo.title);
      setDescription(currentVideo.description);
      setTags(currentVideo.tags?.join(', '));
      setCategory(currentVideo.category || '');
      setPrivacyStatus(currentVideo.privacyStatus || 'public');
    }
  }, [currentVideo]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('privacyStatus', privacyStatus);
    if (videoFile) formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    const success = await dispatch(updateVideo({ videoId, formData }));

    if (success) {
      navigate(`/videos/${videoId}`); // Redirect to the video's details page after update
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this video?');
    if (confirmDelete) {
      const result = await dispatch(deleteVideo(videoId));
      if (!result.error) {
        navigate('/videos'); // Redirect to the videos list after successful deletion
      }
    }
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Update Video</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label htmlFor="tags" className="text-sm font-medium">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select a Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Privacy Status */}
        <div className="flex flex-col">
          <label htmlFor="privacyStatus" className="text-sm font-medium">
            Privacy Status
          </label>
          <select
            id="privacyStatus"
            value={privacyStatus}
            onChange={(e) => setPrivacyStatus(e.target.value)}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="follower">Follower</option>
          </select>
        </div>

        {/* Video File */}
        <div className="flex flex-col">
          <label htmlFor="video" className="text-sm font-medium">
            Upload New Video (optional)
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Thumbnail File */}
        <div className="flex flex-col">
          <label htmlFor="thumbnail" className="text-sm font-medium">
            Upload New Thumbnail (optional)
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
            className="mt-2 bg-black p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-200"
        >
          Update Video
        </button>

          <button
            type="button"
            onClick={handleDelete}
            className="py-3 px-6 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-200"
          >
            Delete Video
          </button>
      </form>
    </div>
  );
};

export default UpdateVideo;




