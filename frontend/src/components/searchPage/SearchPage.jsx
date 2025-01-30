import React, { useState } from 'react';
import axios from 'axios';
import DisplayPage from '../displayPage/DisplayPage';

const SearchPage = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState(null);
  const [existingCourses, setExistingCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setPlaylistData(null);
    setExistingCourses([]);

    try {
      const isYoutubeUrl = playlistUrl.includes('youtube.com');
      
      if (isYoutubeUrl) {
        // Handle YouTube playlist
        const playlistId = extractPlaylistId(playlistUrl);
        if (!playlistId) throw new Error("Invalid Playlist URL");
        
        const [playlistInfo, videos] = await Promise.all([
          getPlaylistInfo(playlistId),
          getAllPlaylistVideos(playlistId)
        ]);
        
        setPlaylistData({ title: playlistInfo.title, items: videos });
      } else {
        // Search existing courses
        const response = await axios.get('http://localhost:3000/api/courses', {
          params: { search: playlistUrl }
        });
        setExistingCourses(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistInfo = async (playlistId) => {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/playlists',
      {
        params: {
          part: 'snippet',
          id: playlistId,
          key: import.meta.env.VITE_YOUTUBE_API,
        }
      }
    );
    return response.data.items[0].snippet;
  };

  const getAllPlaylistVideos = async (playlistId) => {
    let allVideos = [];
    let nextPageToken = null;
    
    do {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          params: {
            part: 'snippet',
            playlistId,
            key: import.meta.env.VITE_YOUTUBE_API,
            maxResults: 50,
            pageToken: nextPageToken,
          }
        }
      );
      
      const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnail: item.snippet.thumbnails?.default?.url,
      }));
      
      allVideos = allVideos.concat(videos);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allVideos;
  };

  const extractPlaylistId = (url) => {
    const match = url.match(/[&?]list=([^&]+)/i);
    return match ? match[1] : null;
  };

  return (
    <div className="search-container">
      <h2>Course Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter YouTube playlist URL or search existing courses"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {existingCourses.length > 0 && (
        <div className="existing-courses">
          <h3>Found Courses:</h3>
          {existingCourses.map(course => (
            <div key={course._id} className="course-card">
              <h4>{course.playlistTitle}</h4>
              <p>{course.modules.length} modules • {course.modules.reduce((acc, mod) => acc + mod.videos.length, 0)} videos</p>
              <button onClick={() => setPlaylistData({
                title: course.playlistTitle,
                items: course.modules.flatMap(module => module.videos)
              })}>
                View Course
              </button>
            </div>
          ))}
        </div>
      )}

      {playlistData && (
        <DisplayPage 
          playlistTitle={playlistData.title} 
          videos={playlistData.items} 
          error={error} 
          playlistUrl={playlistUrl}
        />
      )}
    </div>
  );
};

export default SearchPage;

