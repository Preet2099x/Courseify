import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CourseDetailsPage.scss';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div className="loading">Loading course details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="course-details-page">
      <div className="course-header">
        <h1>{course.playlistTitle}</h1>
        <Link to="/courses" className="back-button">
          &larr; All Courses
        </Link>
      </div>

      <div className="course-content">
        {course.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="module-section">
            <h2 className="module-title">{module.title}</h2>
            <div className="videos-grid">
              {module.videos.map((video, videoIndex) => (
                <div key={video.videoId} className="video-card">
                  <div className="thumbnail-container">
                    <img
                      src={video.thumbnail?.replace('default.jpg', 'maxresdefault.jpg')}
                      alt={video.title}
                      className="video-thumbnail"
                      onError={(e) => {
                        e.target.src = video.thumbnail?.replace('default.jpg', 'hqdefault.jpg');
                      }}
                    />
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-button"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetailsPage;