import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PublicCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Public Courses</h1>
      {courses.map(course => (
        <div key={course._id}>
          <h3>{course.playlistTitle}</h3>
          <p>Videos: {course.modules[0].videos.length}</p>
        </div>
      ))}
    </div>
  );
};

export default PublicCoursesPage;