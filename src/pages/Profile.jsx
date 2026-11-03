import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const saveProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.patch('/users/me', { name });
      showToast('Profile updated', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.patch('/users/me/password', { currentPassword, newPassword });
      showToast('Password changed', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: 30 }}>
      <h2>Profile</h2>
      {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={saveProfile} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <label className="muted">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="muted">Email</label>
        <input className="input" value={user?.email || ''} disabled />
        <button className="btn" type="submit">Save profile</button>
      </form>

      <form onSubmit={savePassword} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label className="muted">Current password</label>
        <input className="input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <label className="muted">New password</label>
        <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} />
        <button className="btn" type="submit">Change password</button>
      </form>
    </div>
  );
}
