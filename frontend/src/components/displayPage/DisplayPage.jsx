// DisplayPage.jsx
import React from 'react';

const DisplayPage = ({ playlistTitle, videos, error }) => {
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!playlistTitle || !videos) {
    return null;
  }

  return (
    <div>
      <h1>{playlistTitle}</h1>
      <p>Total Videos: {videos.length}</p> {/* Display total video count */}
      <ul>
        {videos.map((video) => (
          <li key={video.videoId}>
            {video.title}
            {video.thumbnail && <img src={video.thumbnail} alt={video.title} />}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`} // Corrected YouTube link
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Watch</button>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPage;