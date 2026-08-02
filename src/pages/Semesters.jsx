import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buildAncestorTrail } from '../utils/breadcrumbs.js';

export default function Semesters() {
  const { levelId } = useParams();
  const [level, setLevel] = useState(null);
  const [ancestors, setAncestors] = useState([]);

  useEffect(() => {
    api.get(`/levels/${levelId}`).then((res) => setLevel(res.data.data));
  }, [levelId]);

  useEffect(() => {
    if (level) buildAncestorTrail('programme', level.programmeId).then(setAncestors);
  }, [level]);

  if (!level) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs ancestors={ancestors} current={`Level ${level.name}`} />
      <h2>Level {level.name}</h2>
      <p className="muted">Choose a semester</p>
      {level.semesters.length === 0 ? (
        <EmptyState icon="🗓️" title="No semesters yet" message="Nothing has been added under this level yet." />
      ) : (
        <div className="grid">
          {level.semesters.map((s) => (
            <Link key={s.id} to={`/semesters/${s.id}`} className="card">
              <div style={{ fontWeight: 600 }}>{s.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
