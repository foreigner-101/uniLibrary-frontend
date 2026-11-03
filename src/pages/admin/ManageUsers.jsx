import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const ROLES = ['STUDENT', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];

export default function ManageUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api.get('/users').then((res) => {
      setUsers(res.data.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      load();
      showToast('Role updated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Only a Super Admin can change roles', 'error');
    }
  };

  return (
    <div>
      <h2>Users</h2>
      {loading ? (
        <p className="muted">Loading...</p>
      ) : users.length === 0 ? (
        <EmptyState icon="👤" title="No users yet" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {users.map((u) => (
            <div key={u.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div className="muted">{u.email}</div>
              </div>
              <select
                className="input"
                style={{ width: 160 }}
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value)}
                aria-label={`Change role for ${u.name}`}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
