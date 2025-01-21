import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchPlaylist = async () => {
    setError(null);
    try {
      const playlistId = extractPlaylistId(playlistUrl);
      if (!playlistId) {
        setError("Invalid Playlist URL");
        return;
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet',
            playlistId: playlistId,
            key: import.meta.env.VITE_YOUTUBE_API,
            maxResults: 50,
          },
        }
      );

      if (!response.data.items || response.data.items.length === 0) {
        setError("No videos found in playlist");
        return;
      }

      // Extract playlist title from response data (assuming it's in the snippet.title of the first item)
      const playlistTitle = response.data.items[0].snippet.title;

      setPlaylistTitle(playlistTitle);
      setVideos(
        response.data.items.map((item) => ({
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
          thumbnail: item.snippet.thumbnails?.default?.url,
        }))
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const extractPlaylistId = (url) => {
    const regExp = /[&?]list=([^&]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div id="main">
      <h2>YouTube Course Converter</h2>
      <input
        type="text"
        placeholder="Enter Playlist Link"
        value={playlistUrl}
        onChange={(e) => setPlaylistUrl(e.target.value)}
      />
      <button onClick={handleFetchPlaylist}>Convert</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {playlistTitle && <h1>{playlistTitle}</h1>} {/* Display Playlist Title from response */}

      {videos.length > 0 && ( // Conditionally render the list
        <ul>
          {videos.map((video) => (
            <li key={video.videoId}>
              {video.title}
              {video.thumbnail && <img src={video.thumbnail} alt={video.title} />} {/* Display thumbnail */}
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
      )}
    </div>
  );
}

export default App;