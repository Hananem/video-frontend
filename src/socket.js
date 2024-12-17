import { io } from 'socket.io-client';
import { useSelector } from 'react-redux'; // Import useSelector hook to get state

// Initialize socket to be used later
let socket;

const setupSocket = (userId) => {
  // Check if userId exists before connecting
  if (userId) {
    if (!socket) {
      // Initialize the socket connection and pass the userId in the query parameter
      socket = io('http://localhost:4000', {
        transports: ['websocket'],
        query: { userId }, // Pass the dynamic userId here
      });

      // Emit join event with user ID
      socket.emit('join', userId);

      // Listen for notifications
      socket.on('receiveNotification', (data) => {
        console.log('Notification received:', data);
      });
    }
  } else {
    console.log('User not authenticated or userId not available');
  }
};

export { socket, setupSocket };

