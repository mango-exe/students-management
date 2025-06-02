import React, { useState } from 'react';
import StudentRegister from './StudentRegister';
import TeacherRegister from './TeacherRegister';

export default function Home() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h1>University Management</h1>
        <button onClick={() => setRole('student')} style={{ marginRight: 20, padding: '10px 20px' }}>Student</button>
        <button onClick={() => setRole('teacher')} style={{ padding: '10px 20px' }}>Teacher</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      {role === 'student' && <StudentRegister />}
      {role === 'teacher' && <TeacherRegister />}
      <button style={{ marginTop: 20 }} onClick={() => setRole(null)}>Back</button>
    </div>
  );
}
