import React, { useEffect, useState } from 'react';
import api from '../api';

export default function CourseStudents({ teacherId, course, onClose }) {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({}); // { studentId: gradeValue }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMessage(null);

    // Fetch students in this course
    api.get(`/courses/${course.id}/students`)
      .then(res => {
        setStudents(res.data);
        // Initialize grades state to empty strings for each student
        const initialGrades = {};
        res.data.forEach(s => { initialGrades[s.id] = ''; });
        setGrades(initialGrades);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, [course.id]);

  // Handle grade input change
  const handleGradeChange = (studentId, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // Submit grade for a student
  const submitGrade = async (studentId) => {
    const value = grades[studentId];
    if (value === '') {
      setMessage('Please enter a grade before submitting.');
      return;
    }
    setMessage(null);
    try {
      await api.post(`/courses/${course.id}/grade`, {
        teacherId,
        studentId,
        value,
      });
      setMessage(`Grade submitted for student ${studentId}`);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit grade');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, marginTop: 16 }}>
      <h3>Students in "{course.title}"</h3>
      <button onClick={onClose} style={{ marginBottom: 10 }}>Close</button>

      {loading && <p>Loading students...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        students.length === 0 ? (
          <p>No students have joined this course yet.</p>
        ) : (
          <ul>
            {students.map(s => (
              <li key={s.id} style={{ marginBottom: 10 }}>
                <span>{s.name} ({s.email})</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Grade"
                  value={grades[s.id]}
                  onChange={e => handleGradeChange(s.id, e.target.value)}
                  style={{ marginLeft: 10, width: 60 }}
                />
                <button onClick={() => submitGrade(s.id)} style={{ marginLeft: 5 }}>
                  Submit Grade
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}
