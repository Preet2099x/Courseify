import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [videos, setVideos] = useState([]); // Changed from chapters to videos
  const [error, setError] = useState(null);

  const handleFetchPlaylist = async () => {
    setError(null); // Clear previous errors
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
            key: 'AIzaSyBRJhan2CMPyz_D2EKu_I3X8dtyEI1HgoM', // Replace with your API key
            maxResults: 50,
          },
        }
      );

      if (!response.data.items || response.data.items.length === 0) {
        setError("No videos found in playlist");
        return;
      }

      const firstVideoTitle = response.data.items[0].snippet.title;
      const extractedTitle = firstVideoTitle.split(" - ")[0];
      setPlaylistTitle(extractedTitle);
      setVideos(
        response.data.items.map((item) => ({
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
        }))
      );
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
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
    </div>
  );
}

export default App;