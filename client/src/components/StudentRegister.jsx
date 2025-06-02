import React, { useState } from 'react';
import api from '../api';
import StudentDashboard from './StudentDashboard';

export default function StudentRegister() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/students', form);
      setStudent(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating student');
    }
  };

  if (student) {
    return <StudentDashboard student={student} />;
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Student Account</h2>
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({...form, email: e.target.value})}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Create Student</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
