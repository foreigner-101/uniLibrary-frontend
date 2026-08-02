import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buildAncestorTrail } from '../utils/breadcrumbs.js';

export default function Courses() {
  const { semesterId } = useParams();
  const [semester, setSemester] = useState(null);
  const [ancestors, setAncestors] = useState([]);

  useEffect(() => {
    api.get(`/semesters/${semesterId}`).then((res) => setSemester(res.data.data));
  }, [semesterId]);

  useEffect(() => {
    if (semester) buildAncestorTrail('level', semester.levelId).then(setAncestors);
  }, [semester]);

  if (!semester) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs ancestors={ancestors} current={semester.name} />
      <h2>{semester.name}</h2>
      <p className="muted">Choose a course</p>
      {semester.courses.length === 0 ? (
        <EmptyState icon="📖" title="No courses yet" message="Nothing has been added under this semester yet." />
      ) : (
        <div className="grid">
          {semester.courses.map((c) => (
            <Link key={c.id} to={`/courses/${c.id}`} className="card">
              <div style={{ fontWeight: 600 }}>{c.code}</div>
              <div className="muted">{c.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
