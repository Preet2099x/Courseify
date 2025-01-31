import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CoursesPage.scss';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="courses-page">
      <div className="header">
        <h1>COURSES</h1>
        <p>Challenging multi-step experiences with quizzes and progress-tracking</p>
      </div>
      
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <div className="course-thumbnail">
              {course.modules[0]?.videos[0]?.thumbnail && (
                <img 
                  src={course.modules[0].videos[0].thumbnail} 
                  alt={course.playlistTitle} 
                />
              )}
            </div>
            <div className="course-info">
              <h3>{course.playlistTitle}</h3>
              <p>Videos: {course.modules.reduce((total, module) => total + module.videos.length, 0)}</p>
              <Link 
                to={`/courses/${course._id}`} 
                className="view-course-button"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;