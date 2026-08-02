import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ResourceCard from '../components/ResourceCard.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { buildAncestorTrail } from '../utils/breadcrumbs.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Resources() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [ancestors, setAncestors] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const loadFavorites = useCallback(() => {
    if (!user) return;
    api.get('/favorites').then((res) => {
      setFavoriteIds(new Set(res.data.data.map((f) => f.resourceId)));
    });
  }, [user]);

  useEffect(() => {
    api.get(`/courses/${courseId}`).then((res) => setCourse(res.data.data));
    loadFavorites();
  }, [courseId, loadFavorites]);

  useEffect(() => {
    if (course) buildAncestorTrail('semester', course.semesterId).then(setAncestors);
  }, [course]);

  if (!course) {
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <Breadcrumbs ancestors={ancestors} current={`${course.code} — ${course.name}`} />
      <h2>
        {course.code} — {course.name}
      </h2>
      {course.resources.length === 0 ? (
        <EmptyState
          icon="📕"
          title="No resources yet"
          message="Nothing has been added for this course yet — check back soon."
        />
      ) : (
        <div className="grid" style={{ marginTop: 20 }}>
          {course.resources.map((r) => (
            <ResourceCard
              key={r.id}
              resource={r}
              isFavorited={favoriteIds.has(r.id)}
              onFavoriteChange={loadFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}
