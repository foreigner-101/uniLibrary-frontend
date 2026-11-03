import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/universities').then((res) => {
      setUniversities(res.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>Universities</h2>
      {loading ? (
        <SkeletonGrid />
      ) : universities.length === 0 ? (
        <EmptyState icon="🏛️" title="No universities yet" message="Check back soon, or ask an admin to add one." />
      ) : (
        <div className="grid">
          {universities.map((u) => (
            <Link key={u.id} to={`/universities/${u.id}`} className="card">
              <div style={{ fontWeight: 600 }}>{u.name}</div>
              {u.country && <div className="muted">{u.country}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
