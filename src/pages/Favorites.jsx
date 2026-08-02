import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import ResourceCard from '../components/ResourceCard.jsx';
import SkeletonGrid from '../components/SkeletonGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api.get('/favorites').then((res) => {
      setFavorites(res.data.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>Your Favorites</h2>
      {loading ? (
        <SkeletonGrid />
      ) : favorites.length === 0 ? (
        <EmptyState icon="⭐" title="No favorites yet" message="Save resources while browsing to find them here later." />
      ) : (
        <div className="grid" style={{ marginTop: 20 }}>
          {favorites.map((f) => (
            <ResourceCard key={f.resource.id} resource={f.resource} isFavorited onFavoriteChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}
