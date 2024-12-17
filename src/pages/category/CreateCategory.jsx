import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../../redux/categorySlice'; // Adjust the path as needed

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.categories);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert('Please provide a category name.');
      return;
    }

    dispatch(createCategory({ name, imageFile }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category Image</label>
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          {loading ? 'Creating...' : 'Create Category'}
        </button>
      </form>

 
    </div>
  );
};

export default CreateCategory;

