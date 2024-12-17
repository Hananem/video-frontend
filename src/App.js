import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setupSocket } from './socket';
import Sidebar from './pages/Sidebar'; // Adjust the path to your Sidebar component
import Navbar from './pages/Navbar'; // Adjust the path to your Navbar component
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import Videos from './pages/videos/Videos';
import UploadVideo from './pages/videos/UploadVideo';
import UpdateVideo from './pages/videos/UpdateVideo';
import VideoDetails from './pages/videos/VideoDetails';
import VideosByCategory from "./pages/videos/VideosByCategory";
import CreateCategory from "./pages/category/CreateCategory";
import CategorySetting from "./pages/category/CategorySetting";
import SearchResults from "./pages/SearchResults";
import VideosByUser from './pages/videos/VideosByUser';
import UpdateProfile from './pages/profile/UpdateProfile';
import Followers from './pages/profile/Followers';
import Following from './pages/profile/Following';
import SavedVideos from './pages/profile/SavedVideos';

const App = () => {
  const user = useSelector((state) => state.auth.user.user); // Assuming user state is under auth

  useEffect(() => {
      if (user && user._id) {
          setupSocket(user._id); // Pass the user's ID to setupSocket
      }
  }, [user]);
  return (
   
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id/edit" element={<UpdateProfile />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/upload-video" element={<UploadVideo />} />
              <Route path="/update-video/:videoId" element={<UpdateVideo />} />
              <Route path="/videos/:id" element={<VideoDetails />} />
              <Route path="/user/:userId/videos" element={<VideosByUser />} />
              <Route path="/category/:categoryId" element={<VideosByCategory />} />
              <Route path="/create-category" element={<CreateCategory />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="category-setting" element={<CategorySetting />} />
              <Route path="followers/:id" element={<Followers />} />
              <Route path="following/:id" element={<Following />} />
              <Route path="saved-videos/:id" element={<SavedVideos />} />
            </Routes>
          </main>
        </div>
      </div>
   
  );
};

export default App;

