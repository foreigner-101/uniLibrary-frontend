import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminDashboard() {
  const { isSuperAdmin } = useAuth();

  return (
    <div className="container admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin</h3>
        <nav className="admin-nav">
          <Link to="/admin/structure">Structure</Link>
          <Link to="/admin/resources">Resources</Link>
          {isSuperAdmin && <Link to="/admin/users">Users</Link>}
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
