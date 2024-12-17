import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/videos');
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div>
      <h2>Videos </h2>
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video._id} style={{ position: 'relative', width: '400px', margin: '20px 0' }}>
              <h3>{video.title}</h3>
              {/* Video element with controls disabled */}
              <video width="400">
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Overlay div to prevent playback */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
              }}>
                Video Locked
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Videos;

