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

      // 1. Fetch playlist metadata (including title)
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists`,
        {
          params: {
            part: 'snippet',
            id: playlistId, // Use 'id' to get specific playlist info
            key: import.meta.env.VITE_YOUTUBE_API,
          },
        }
      );

      if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
        setError("Playlist not found");
        return;
      }

      const playlistTitle = playlistResponse.data.items[0].snippet.title;
      setPlaylistTitle(playlistTitle);

      // 2. Fetch playlist items (videos)
      const playlistItemsResponse = await axios.get(
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

      if (!playlistItemsResponse.data.items || playlistItemsResponse.data.items.length === 0) {
        setError("No videos found in playlist");
        return;
      }

      setVideos(
        playlistItemsResponse.data.items.map((item) => ({
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
        placeholder="Enter YouTube Playlist Link"
        value={playlistUrl}
        onChange={(e) => setPlaylistUrl(e.target.value)}
      />
      <button onClick={handleFetchPlaylist}>Convert</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {playlistTitle && <h1>{playlistTitle}</h1>} {/* Display actual playlist title */}

      {videos.length > 0 && (
        <ul>
          {videos.map((video) => (
            <li key={video.videoId}>
              {video.title}
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
        </ul>
      )}
    </div>
  );
}

export default App;