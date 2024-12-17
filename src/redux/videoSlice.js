import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/videos';

// Async thunk to fetch videos by user ID
export const fetchVideosByUser = createAsyncThunk(
  'videos/fetchVideosByUser',
  async (userId, { getState, rejectWithValue }) => {
    try {
      // Get the token from Redux state
      const { auth } = getState();
      const token = auth.token; // Get the token from auth state

      // Send request to the backend with authorization header
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      return response.data; // Return the fetched videos data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Handle error
    }
  }
);
// Async thunk for uploading a video
export const uploadVideo = createAsyncThunk(
  'videos/uploadVideo',
  async (videoData, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const token = auth.token;

    try {
      const { data } = await axios.post(`${API_URL}/upload`, videoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return data.video;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const watchVideo = createAsyncThunk(
  'videos/watchVideo',
  async (videoId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState(); // Get the auth state from Redux
      const token = auth.token; // Extract the token from the auth state

      // Make a POST request to mark the video as watched with the Bearer token
      const response = await axios.post(
        `http://localhost:4000/api/profile/watch/${videoId}`,
        {}, // Pass an empty object as the request body (if required)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token to headers
          },
        }
      );

      console.log(response.data);
      const video = response.data; // The video data returned from the API

      return video; // Return the video details to update Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch video');
    }
  }
);


export const updateVideo = createAsyncThunk(
  'videos/updateVideo',
  async ({ videoId, formData }, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Extract auth state
    const token = auth?.token; // Assuming token is stored in auth.user.token

    if (!token) {
      return rejectWithValue({ message: 'Unauthorized: No token found' });
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/videos/update/${videoId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Include the 'Bearer' prefix
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);
// Async thunk for fetching all videos
export const getAllVideos = createAsyncThunk('videos/getAllVideos', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/all`)
    return data.videos;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching a video by ID
export const getVideoById = createAsyncThunk('videos/getVideoById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for deleting a video
export const deleteVideo = createAsyncThunk(
  'videos/deleteVideo',
  async (videoId, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Get the state containing auth info
    const token = auth?.token;   // Extract the token

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
          },
        }
      );
      return response.data; // Return the success message or video ID
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete video');
    }
  }
);


// Async thunk for toggling a reaction
export const toggleReaction = createAsyncThunk(
  'videos/toggleReaction',
  async ({ videoId, type }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const token = auth.token;

    try {
      const { data } = await axios.post(
        `${API_URL}/${videoId}/reactions`,
        { type },
        {
          headers: { Authorization: `Bearer ${token}`, },
        }
      );
      console.log(data.video)
      return data.video;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for toggling save
export const toggleSave = createAsyncThunk(
  'videos/toggleSave',
  async (videoId, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const token = auth.token;

    try {
      const { data } = await axios.post(
        `${API_URL}/${videoId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}`, },
        }
      );
      return data.savedVideos;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating privacy status
export const updatePrivacyStatus = createAsyncThunk(
  'videos/updatePrivacyStatus',
  async ({ videoId, privacyStatus }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const token = auth.token;

    try {
      const { data } = await axios.put(
        `${API_URL}/${videoId}/privacy`,
        { privacyStatus },
        {
          headers: { Authorization: `Bearer ${token}`, },
        }
      );
      return data.video;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  'videos/addComment',
  async ({ videoId, text }, { rejectWithValue, getState }) => {
    const { auth } = getState(); // Assuming token is in the auth slice
    const token = auth.token;

    try {
      const response = await axios.post(
        `${API_URL}/comments/${videoId}`, // Correct route structure
        { text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data)
      return response.data; // Return the new comment
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add comment'
      );
    }
  }
);


// Delete a comment
export const deleteComment = createAsyncThunk(
  'video/deleteComment',
  async (commentId, { rejectWithValue, getState }) => {
      try {
          // Get the token from the Redux state
          const { auth } = getState();
          const token = auth.token;

          // Make the API call to delete the comment
          const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
              headers: {
                  Authorization: `Bearer ${token}`, // Add the token to the request headers
              },
          });
console.log(response.data)
          return response.data; // Return the commentId to be used in the reducer

      } catch (error) {
          return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
      }
  }
);


// Update a comment
export const updateComment = createAsyncThunk(
  'video/updateComment',
  async ({ commentId, text }, { rejectWithValue, getState }) => {
    try {
      // Get the token from the Redux state
      const { auth } = getState();
      const token = auth.token;

      // Make the API call to update the comment
      const response = await axios.put(
        `${API_URL}/comments/${commentId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        }
      );
console.log(response.data)
      return response.data; // Updated comment
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);


// Add a reply to a comment
export const addReply = createAsyncThunk(
  'video/addReply',
  async ({ commentId, text }, { rejectWithValue, getState }) => {
    try {
      // Retrieve the token from the Redux state
      const { auth } = getState();
      const token = auth.token;

      // Perform the API request with Authorization header
      const response = await axios.post(
        `${API_URL}/comments/${commentId}/reply`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );

      console.log(response.data);
      return response.data; // Return the new reply data
    } catch (error) {
      // Handle error and return a rejection
      return rejectWithValue(error.response?.data?.message || 'Failed to add reply');
    }
  }
);

export const toggleLikeComment = createAsyncThunk(
  'videos/toggleLikeComment',
  async (commentId, { rejectWithValue, getState }) => {
    const { auth } = getState();
    const token = auth.token;

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/videos/comments/${commentId}/like`,
        {}, // No body needed for this request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.likes; // Return the updated comment
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like on comment');
    }
  }
);

export const fetchVideosByCategory = createAsyncThunk(
  'videos/fetchVideosByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/videos/category/${categoryId}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const globalSearch = createAsyncThunk(
  'videos/globalSearch',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/videos?query=${query}`);
      console.log(response.data)
      return response.data; // This includes both users and videos
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error occurred');
    }
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    results: [],
    videosbycategory:[],
    videosByUser:[],
    currentVideo: null,
    loading: 'idle', // idle, pending, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchVideosByUser.pending, (state) => {
      state.loading = true;  // Set loading to true when fetching starts
      state.error = null;    // Clear any previous errors
    })
    .addCase(fetchVideosByUser.fulfilled, (state, action) => {
      state.loading = false;  // Set loading to false after fetching is complete
      state.videosByUser = action.payload;  // Store the fetched videos in state
    })
    .addCase(fetchVideosByUser.rejected, (state, action) => {
      state.loading = false;  // Set loading to false in case of error
      state.error = action.payload;  // Store error in state
    })
      // Upload video
      .addCase(uploadVideo.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.videos.push(action.payload.video);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Get all videos
      .addCase(getAllVideos.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.videos = action.payload;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Get video by ID
      .addCase(getVideoById.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentVideo = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
       state.videos=action.payload.video;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete video
    // Handle deleteVideo lifecycle
    .addCase(deleteVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = state.videos.filter(
        (video) => video._id !== action.payload.videoId
      ); 
    })
    .addCase(deleteVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to delete video';
    })

      // Toggle reaction
      .addCase(toggleReaction.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(toggleReaction.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        if (state.currentVideo && state.currentVideo.reactions) {
          state.currentVideo.reactions = action.payload.reactions;
        }
       
       
      })
      .addCase(toggleReaction.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

       // Handle "watch video" action
      .addCase(watchVideo.pending, (state) => {
        state.loading = 'pending'; // Video is loading
        state.error = null;
      })
      .addCase(watchVideo.fulfilled, (state, action) => {
        state.loading = 'succeeded'; // Video loaded successfully
        state.currentVideo.views = action.payload.views; // Store video data in currentVideo
      })
      .addCase(watchVideo.rejected, (state, action) => {
        state.loading = 'failed'; // Failed to load the video
        state.error = action.payload;
      })

 
      // Update privacy status
      .addCase(updatePrivacyStatus.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(updatePrivacyStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        if (state.currentVideo && state.currentVideo._id === action.payload._id) {
          state.currentVideo.privacyStatus = action.payload.video.privacyStatus;
        }
      })
      .addCase(updatePrivacyStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

         // Add a new comment
         .addCase(addComment.fulfilled, (state, action) => {
          if (state.currentVideo) {
              state.currentVideo.comments.push(action.payload.comment); // Add the new comment
          }
      })
      // Delete a comment
      .addCase(deleteComment.fulfilled, (state, action) => {
          if (state.currentVideo) {
              state.currentVideo.comments = state.currentVideo.comments.filter(
                  (comment) => comment._id !== action.payload.commentId
              );
          }
      })
      // Update a comment
      .addCase(updateComment.fulfilled, (state, action) => {
          if (state.currentVideo) {
              const index = state.currentVideo.comments.findIndex(
                  (comment) => comment._id === action.payload.comment._id
              );
              if (index !== -1) {
                  state.currentVideo.comments[index] = action.payload.comment; // Update the comment
              }
          }
      })
      // Add a reply to a comment
      .addCase(addReply.fulfilled, (state, action) => {
          if (state.currentVideo) {
              const parentComment = state.currentVideo.comments.find(
                  (comment) => comment._id === action.payload.parentCommentId
              );
              if (parentComment) {
                  parentComment.replies.push(action.payload.reply); // Add the reply
              }
          }
      })
 
 // Toggle like on a comment
 .addCase(toggleLikeComment.pending, (state) => {
  state.loading = 'pending';
})
.addCase(toggleLikeComment.fulfilled, (state, action) => {
  state.loading = 'succeeded';
  const updatedLikes = action.payload; // This will be the updated likes array

  // Update the likes array for the comment in the current video
  if (state.currentVideo) {
    const commentIndex = state.currentVideo.comments.findIndex(
      (comment) => comment._id === action.meta.arg // Using the commentId from the payload
    );
    if (commentIndex !== -1) {
      state.currentVideo.comments[commentIndex].likes = updatedLikes; // Update likes
    }
  }
})
.addCase(toggleLikeComment.rejected, (state, action) => {
  state.loading = 'failed';
  state.error = action.payload;
})
      .addCase(fetchVideosByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideosByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.videosbycategory = action.payload;
      })
      .addCase(fetchVideosByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(globalSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload; // Set the results (users and videos)
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })

      // Handle errors
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export default videoSlice.reducer;

