import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buildAncestorTrail } from '../utils/breadcrumbs.js';

export default function Levels() {
  const { programmeId } = useParams();
  const [programme, setProgramme] = useState(null);
  const [ancestors, setAncestors] = useState([]);

  useEffect(() => {
    api.get(`/programmes/${programmeId}`).then((res) => setProgramme(res.data.data));
  }, [programmeId]);

  useEffect(() => {
    if (programme) buildAncestorTrail('faculty', programme.facultyId).then(setAncestors);
  }, [programme]);

  if (!programme) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs ancestors={ancestors} current={programme.name} />
      <h2>{programme.name}</h2>
      <p className="muted">Choose a level</p>
      {programme.levels.length === 0 ? (
        <EmptyState icon="📚" title="No levels yet" message="Nothing has been added under this programme yet." />
      ) : (
        <div className="grid">
          {programme.levels.map((l) => (
            <Link key={l.id} to={`/levels/${l.id}`} className="card">
              <div style={{ fontWeight: 600 }}>Level {l.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
