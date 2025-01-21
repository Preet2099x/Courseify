// SearchPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import DisplayPage from '../displayPage/DisplayPage';

const SearchPage = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleFetchPlaylist = async () => {
    setError(null);
    setLoading(true);
    setSearchInitiated(true); // Set searchInitiated to true *before* fetching

    try {
      const playlistId = extractPlaylistId(playlistUrl);
      if (!playlistId) {
        throw new Error("Invalid Playlist URL");
      }

      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists`,
        {
          params: {
            part: 'snippet',
            id: playlistId,
            key: import.meta.env.VITE_YOUTUBE_API,
          },
        }
      );

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

      setPlaylistData({
        title: playlistResponse.data.items[0].snippet.title,
        items: playlistItemsResponse.data.items.map((item) => ({
          title: item.snippet.title,
          videoId: item.snippet.resourceId.videoId,
          thumbnail: item.snippet.thumbnails?.default?.url,
        })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractPlaylistId = (url) => {
    const regExp = /[&?]list=([^&]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFetchPlaylist();
  };

  if (searchInitiated && playlistData) {
    return <DisplayPage playlistTitle={playlistData.title} videos={playlistData.items} error={error}/>;
  }

  return (
    <div>
      <h2>ADD COURSE</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter YouTube Playlist Link"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />
        <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
        </button>
      </form>
        {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default SearchPage;