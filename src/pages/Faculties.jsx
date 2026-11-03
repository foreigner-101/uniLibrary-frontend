import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Faculties() {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    api.get(`/universities/${universityId}`).then((res) => setUniversity(res.data.data));
  }, [universityId]);

  if (!university) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs current={university.name} />
      <h2>{university.name}</h2>
      {university.faculties.length === 0 ? (
        <EmptyState icon="🏫" title="No faculties yet" message="Nothing has been added under this university yet." />
      ) : (
        <div className="grid">
          {university.faculties.map((f) => (
            <Link key={f.id} to={`/faculties/${f.id}`} className="card">
              <div style={{ fontWeight: 600 }}>{f.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
