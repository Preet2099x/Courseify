import React, { useState } from 'react';
import axios from 'axios';

const DisplayPage = ({ playlistTitle, videos, error, playlistUrl }) => { // Added playlistUrl prop
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddCourse = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Structure the course data with actual playlist URL
      const courseData = {
        playlistTitle,
        playlistUrl: playlistUrl, 
        modules: [{
          title: "All Videos",
          videos: videos.map(video => ({
            title: video.title,
            videoId: video.videoId,
            thumbnail: video.thumbnail
          }))
        }]
      };

      // Send POST request to backend
      const response = await axios.post(
        'http://localhost:3000/api/courses',
        courseData
      );

      if (response.status === 201) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setSaveError(errorMessage.includes('duplicate') 
        ? 'This playlist has already been added to the database!'
        : 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!playlistTitle || !videos) return null;

  return (
    <div>
      <h1>{playlistTitle}</h1>
      <p>Total Videos: {videos.length}</p>
      
      <div className="video-list-container">
        <ol style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {videos.map((video, index) => (
            <li key={video.videoId} style={{ margin: '15px 0', padding: '10px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ minWidth: '30px' }}>{index + 1}.</span>
                {video.thumbnail && (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    style={{ 
                      width: '120px', 
                      margin: '0 15px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                )}
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>{video.title}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button style={{ 
                      marginTop: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#ff0000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      ▶ Watch on YouTube
                    </button>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleAddCourse} 
          disabled={isSaving}
          style={{ 
            padding: '12px 24px',
            fontSize: '1.1rem',
            backgroundColor: isSaving ? '#cccccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {isSaving ? 'Saving to Database...' : 'PUBLISH COURSE'}
        </button>

        {saveSuccess && (
          <p style={{ 
            color: '#4CAF50', 
            marginTop: '15px',
            fontWeight: '500',
            fontSize: '1.1rem'
          }}>
            ✅ Course published successfully! It's now available to everyone.
          </p>
        )}

        {saveError && (
          <p style={{ 
            color: '#f44336', 
            marginTop: '15px',
            fontWeight: '500',
            fontSize: '1.1rem'
          }}>
            ❌ Error: {saveError}
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplayPage;