import React, { useState } from 'react';
import api from '../api';
import TeacherDashboard from './TeacherDashboard';

export default function TeacherRegister() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/teachers', form);
      setTeacher(res.data.user);  // <-- Fix: use res.data.user instead of res.data
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating teacher');
    }
  };

  if (teacher) {
    return <TeacherDashboard teacher={teacher} />;
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Teacher Account</h2>
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Create Teacher</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
