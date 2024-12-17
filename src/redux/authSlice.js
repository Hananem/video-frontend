import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API endpoints
const BASE_URL = 'http://localhost:4000/api/auth';

// Thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      const { token, ...user } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
    return response.data;  // Return the login data (token, user details, etc.)
  } catch (error) {
    return rejectWithValue(error.response.data);  // Return error if login fails
  }
});

// Async thunk to follow/unfollow a user
export const followUser = createAsyncThunk(
  'profile/followUser',
  async (userIdToFollow, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;  // Get token from Redux state
      const response = await axios.post(
        `http://localhost:4000/api/profile/follow/${userIdToFollow}`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in Authorization header
          },
        }
      );
      console.log(response.data)
      return response.data;  // Return the response data if the request is successful
    } catch (error) {
      return rejectWithValue(error.response.data);  // Return error message if the request fails
    }
  }
);

// Async thunk for toggling save/unsave
export const toggleSaveVideo = createAsyncThunk(
  'profile/toggleSaveVideo',
  async (videoId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Get user data from auth slice
      const response = await axios.post(
        `http://localhost:4000/api/videos/${videoId}/save`,  // Using the base URL for the API request
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.savedVideos)
      return response.data.savedVideos; // Return the updated savedVideos list
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle error if any
    }
  }
);

// Create an async thunk to fetch suggested videos
export const getSuggestedVideos = createAsyncThunk(
  'videos/getSuggestedVideos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Access the token from the auth slice
      const response = await axios.get('http://localhost:4000/api/videos', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      return response.data.videos; // Assuming the response contains the videos array
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Create an async thunk to fetch videos from followed users
export const getFollowedUsersVideos = createAsyncThunk(
  'videos/getFollowedUsersVideos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Access the token from the auth slice
      const response = await axios.get('http://localhost:4000/api/followed', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      return response.data.videos; // Assuming the response contains the videos array
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Async Thunks for removing follower and following
export const removeFollower = createAsyncThunk(
  'user/removeFollower',
  async (followerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Access token from auth slice
      const response = await axios.delete(`http://localhost:4000/api/profile/remove-follower/${followerId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error removing follower');
    }
  }
);

export const removeFollowing = createAsyncThunk(
  'user/removeFollowing',
  async (followingId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Access token from auth slice
      const response = await axios.delete(`http://localhost:4000/api/profile/remove-following/${followingId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error removing following');
    }
  }
);
// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('authToken') || null,
    suggestedVideos: [],
    followedUsersVideos: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user.user.following = action.payload.following; // Update following list
        localStorage.setItem('user', JSON.stringify(state.user)); // Persist updates
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSaveVideo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleSaveVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.user.savedVideos = action.payload; 
        localStorage.setItem('user', JSON.stringify(state.user)); // Persist updates
        // Update savedVideos in the user state
      })
      .addCase(toggleSaveVideo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Handle error if any
      })

      // Remove Follower
    builder.addCase(removeFollower.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFollower.fulfilled, (state, action) => {
      state.loading = false;
      state.user.user.followers = action.payload.followers; // Updated followers list
      localStorage.setItem('user', JSON.stringify(state.user)); // Persist updates

    });
    builder.addCase(removeFollower.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Remove Following
    builder.addCase(removeFollowing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFollowing.fulfilled, (state, action) => {
      state.loading = false;
      state.user.user.following = action.payload.following; // Updated following list
      localStorage.setItem('user', JSON.stringify(state.user)); // Persist updates

    });
    builder.addCase(removeFollowing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      .addCase(getSuggestedVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuggestedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedVideos = action.payload;
        state.error = null;
      })
      .addCase(getSuggestedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFollowedUsersVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFollowedUsersVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.followedUsersVideos = action.payload;
        state.error = null;
      })
      .addCase(getFollowedUsersVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
