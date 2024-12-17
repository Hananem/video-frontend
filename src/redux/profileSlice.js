import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Replace with your actual API URL

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${id}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Fetch token from Redux state
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Upload profile photo
export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadProfilePhoto',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Fetch token from Redux state
      const response = await axios.post(`${API_BASE_URL}/profile/upload-profile-photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.profilePhoto;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




// Async Thunk for uploading background image
export const uploadBackgroundImage = createAsyncThunk(
  'profile/uploadBackgroundImage',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Fetch token from Redux state
      const response = await axios.post(`${API_BASE_URL}/profile/upload-background-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.backgroundImage;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to delete the profile
export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;  // Access token from the Redux state
      const response = await axios.delete('http://localhost:4000/api/profile/delete', {
        headers: {
          Authorization: `Bearer ${token}`,  // Use Bearer token in the Authorization header
        },
      });
      return response.data;  // Return the response data if successful
    } catch (error) {
      return rejectWithValue(error.response.data);  // Return error message if the request fails
    }
  }
);



// Thunk to fetch followers (optional for refreshing followers count)
export const fetchFollowers = createAsyncThunk(
  'user/fetchFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}/followers`);
      return response.data.followers;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    followers: [],
    following: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.profile;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload profile photo
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.profilePhoto = action.payload;
        }
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handling the background image upload
    builder.addCase(uploadBackgroundImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(uploadBackgroundImage.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        state.user.backgroundImage = action.payload;
      }
    });
    builder.addCase(uploadBackgroundImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    // Handle the "fulfilled" state when profile is successfully deleted
    .addCase(deleteProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = null;  // Clear user profile data after successful deletion
    })
    



       // Handle fetchFollowers
       .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;
