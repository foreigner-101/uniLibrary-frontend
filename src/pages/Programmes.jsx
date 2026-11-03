import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buildAncestorTrail } from '../utils/breadcrumbs.js';

export default function Programmes() {
  const { facultyId } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [ancestors, setAncestors] = useState([]);

  useEffect(() => {
    api.get(`/faculties/${facultyId}`).then((res) => setFaculty(res.data.data));
  }, [facultyId]);

  useEffect(() => {
    if (faculty) buildAncestorTrail('university', faculty.universityId).then(setAncestors);
  }, [faculty]);

  if (!faculty) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs ancestors={ancestors} current={faculty.name} />
      <h2>{faculty.name}</h2>
      {faculty.programmes.length === 0 ? (
        <EmptyState icon="🎓" title="No programmes yet" message="Nothing has been added under this faculty yet." />
      ) : (
        <div className="grid">
          {faculty.programmes.map((p) => (
            <Link key={p.id} to={`/programmes/${p.id}`} className="card">
              <div style={{ fontWeight: 600 }}>{p.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
