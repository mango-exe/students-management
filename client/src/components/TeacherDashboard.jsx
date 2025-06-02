import React, { useEffect, useState } from 'react';
import api from '../api';
import CourseStudents from './CourseStudents';

export default function TeacherDashboard({ teacher }) {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);

  // Load courses by this teacher
  useEffect(() => {
    api.get(`/teachers/${teacher.id}/courses`)
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, [teacher.id]);

  const createCourse = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/courses', { title, teacherId: teacher.id });
      setCourses([...courses, res.data]);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  return (
    <div>
      <h2>Welcome, {teacher.name}</h2>

      <section>
        <h3>Create Course</h3>
        <form onSubmit={createCourse}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Course title"
            required
            style={{ padding: 8, marginRight: 10 }}
          />
          <button type="submit">Create</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </section>

      <section>
        <h3>Your Courses</h3>
        {courses.length === 0 && <p>No courses created yet</p>}
        <ul>
          {courses.map(c => (
            <li key={c.id}>
              <button onClick={() => setSelectedCourse(c)}>{c.title}</button>
            </li>
          ))}
        </ul>
      </section>

      {selectedCourse && (
        <CourseStudents
          teacherId={teacher.id}  // <--- Make sure this is passed!
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
