import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadVideo } from '../../redux/videoSlice';
import { fetchCategories } from '../../redux/categorySlice';
import { CiVideoOn, CiImageOn } from 'react-icons/ci';

const UploadVideo = () => {
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state) => state.videos);
  const categories = useSelector((state) => state.categories.categories);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('public');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('privacyStatus', privacyStatus);

    dispatch(uploadVideo(formData));
  };

  return (
    <div className=" p-6 rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-center mb-6 text-white">Upload Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video & Thumbnail Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Video Input */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer flex flex-col items-center justify-center h-40 w-40 bg-transparent border-2 border-white rounded-lg">
              <CiVideoOn size={30} className="text-white mb-2" />
              <span className="text-sm text-white">
                {video ? video.name : 'Choose Video'}
              </span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
            {/* Video Preview */}
            {video && (
              <video
                controls
                className="h-40 w-full rounded-lg border-2 border-white mt-4"
              >
                <source src={URL.createObjectURL(video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Thumbnail Input */}
          <div className="flex flex-col items-center">
            <label className="cursor-pointer flex flex-col items-center justify-center h-40 w-40 bg-transparent border-2 border-white rounded-lg">
              <CiImageOn size={30} className="text-white mb-2" />
              <span className="text-sm text-white">
                {thumbnail ? thumbnail.name : 'Choose Thumbnail'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
            {/* Thumbnail Preview */}
            {thumbnail && (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail Preview"
                className="h-40 w-40 object-cover rounded-lg border-2 border-white mt-4"
              />
            )}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-sm font-medium text-white">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-3 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-3 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="text-sm font-medium text-white">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma-separated"
              className="mt-2 p-3 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-sm font-medium text-white">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 p-3 bg-transparent border-2 border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select a Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-2 text-white rounded-lg font-semibold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500 text-center">{error.message}</p>}
    </div>
  );
};

export default UploadVideo;

