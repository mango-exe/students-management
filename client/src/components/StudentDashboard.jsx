import React, { useEffect, useState } from 'react';
import api from '../api';

export default function StudentDashboard({ student }) {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState(null);

  // Fetch available courses
  useEffect(() => {
    api.get('/all-courses')
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  // Fetch grades for student
  useEffect(() => {
    api.get(`/students/${student.user.id}/grades`)
      .then(res => setGrades(res.data))
      .catch(() => setGrades([]));
  }, [student.user.id]);

  // Join a course
  const joinCourse = async (courseId) => {
    try {
      console.log('Joining course:', courseId, 'for student:', student.user.id);
      await api.post(`/courses/${courseId}/join`, { studentId: student.user.id }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage(`Joined course successfully!`);

      // Refresh grades after joining
      const res = await api.get(`/students/${student.user.id}/grades`);
      setGrades(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to join course');
    }
  };

  return (
    <div>
      <h2>Welcome, {student.user.name}</h2>

      <section>
        <h3>Available Courses</h3>
        {courses.length === 0 && <p>No courses available</p>}
        <ul>
          {courses.map(c => (
            <li key={c.id}>
              {c.title} &nbsp;
              <button onClick={() => joinCourse(c.id)}>Join</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Your Grades</h3>
        {grades.length === 0 && <p>No grades yet</p>}
        <ul>
          {grades.map(g => (
            <li key={g.id}>
              {g.Course?.title}: {g.value}
            </li>
          ))}
        </ul>
      </section>

      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}
