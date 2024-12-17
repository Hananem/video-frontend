import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory, updateCategory } from '../../redux/categorySlice';
import { useNavigate } from 'react-router-dom';

const CategorySetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error, successMessage } = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({ name: '', image: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle category edit form submit
  const handleEditSubmit = async () => {
    try {
      const updatedCategory = { name: editCategoryData.name, imageFile: editCategoryData.image };
      await dispatch(updateCategory({ id: selectedCategory._id, ...updatedCategory }));
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  // Handle category delete
  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(selectedCategory._id));
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Category Settings</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className=" p-4 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={category.image.url}
              alt={category.name}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <span className="text-lg font-medium mb-4">{category.name}</span>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setEditCategoryData({ name: category.name, image: category.image.url });
                  setShowEditModal(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setShowDeleteModal(true);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className=" p-6 bg-black rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editCategoryData.name}
              onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })}
              placeholder="Category Name"
              className="w-full bg-black p-2 border rounded-lg mb-4"
            />
            <input
              type="file"
              onChange={(e) => setEditCategoryData({ ...editCategoryData, image: e.target.files[0] })}
              className="w-full bg-black p-2 border rounded-lg mb-4"
            />
            <div className="flex space-x-4 justify-end">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete this category?</h2>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySetting;
