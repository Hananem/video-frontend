import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api/categories';

// Thunks for category actions
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ name, imageFile }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      formData.append('name', name);
      if (imageFile) formData.append('image', imageFile);

      const response = await axios.post(`${BASE_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name, imageFile }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      if (name) formData.append('name', name);
      if (imageFile) formData.append('image', imageFile);

      const response = await axios.put(`${BASE_URL}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Backend's success message
        state.categories.push(action.payload.category); // Add the new category
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Backend's error message
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload.updatedCategory;
        state.categories = state.categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted category from the state
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload.categoryId
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
