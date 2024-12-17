import React, { useState, useEffect } from 'react';
import { Bell, MagnifyingGlass } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNotificationMenu } from '../redux/uiSlice';
import { fetchNotifications, markAsRead } from '../redux/notificationSlice';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notificationMenuOpen } = useSelector((state) => state.ui);
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications(user._id));
    }
  }, [dispatch, user]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleNotifications = () => {
    dispatch(toggleNotificationMenu());
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  return (
    <header className="shadow-sm px-4 py-3 flex justify-between items-center">
      {/* Search Bar */}
      <div className="search-bar flex items-center gap-2 mb-4  rounded-full px-4 py-1 shadow-sm bg-deepPurple w-[400px]">
  <input
    type="text"
    placeholder="Search for users or videos..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="flex-grow bg-deepPurple outline-none px-2 py-2 rounded-full text-sm"
  />
  <button
    onClick={handleSearch}
    className="btn-primary p-2 rounded-full flex items-center justify-center"
  >
    <MagnifyingGlass size={20} className="text-white" />
  </button>
</div>


      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-white mr-4">Hello, {user.user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}

        {/* Notification Icon */}
        <button
          onClick={handleToggleNotifications}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative"
        >
          <Bell size={20} />
          {notificationMenuOpen && (
            <div className="absolute top-0 right-0 w-64 bg-white shadow-lg mt-8 rounded-md p-4">
              {/* Notifications List */}
              {loading ? (
                <p>Loading notifications...</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="p-2 mb-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <p className="font-semibold">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {notification.isRead ? 'Read' : 'Unread'}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </button>

        {/* Profile Photo */}
        <img
          src={user.user?.profilePhoto?.url}
          alt="User"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;
