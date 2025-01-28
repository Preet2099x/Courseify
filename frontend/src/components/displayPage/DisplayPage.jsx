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
      <p>Total Videos: {videos.length}</p>
      <div className="video-list-container">
        <ol style={{ listStyleType: 'none', paddingLeft: 0 }}> 
          {videos.map((video, index) => (
            <li key={video.videoId}>
              {index + 1}. {video.title}
              {video.thumbnail && <img src={video.thumbnail} alt={video.title} />}
              <a 
                href={`https://www.youtube.com/watch?v=${video.videoId}`} 
                target="_blank" 
                rel="noopener noreferrer" 
              >
                <button>Watch</button>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <button>ADD COURSE</button> 
    </div>
  );
};

export default DisplayPage;