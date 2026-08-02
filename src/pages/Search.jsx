import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ResourceCard from '../components/ResourceCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

// The search API already returns each resource's full ancestor chain
// (course -> semester -> level -> programme -> faculty -> university) so
// results can show where a course actually lives — no extra fetches needed.
function resourcePathLabel(resource) {
  const course = resource.course;
  if (!course) return null;
  const semester = course.semester;
  const level = semester?.level;
  const programme = level?.programme;
  const faculty = programme?.faculty;
  const university = faculty?.university;
  return [university?.name, faculty?.name, programme?.name].filter(Boolean).join(' › ');
}

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/search', { params: { q } });
      setResults(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h2>Search</h2>
      <form onSubmit={runSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        <input
          className="input"
          placeholder="Search by title, author, or course code..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && !loading && (
        <>
          {results.courses.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3>Courses</h3>
              <div className="grid">
                {results.courses.map((c) => (
                  <Link key={c.id} to={`/courses/${c.id}`} className="card">
                    <div style={{ fontWeight: 600 }}>{c.code}</div>
                    <div className="muted">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.resources.length > 0 && (
            <div>
              <h3>Resources</h3>
              <div className="grid">
                {results.resources.map((r) => (
                  <div key={r.id}>
                    <ResourceCard resource={r} />
                    {resourcePathLabel(r) && (
                      <div className="muted" style={{ fontSize: 12, marginTop: 4, padding: '0 2px' }}>
                        {resourcePathLabel(r)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.courses.length === 0 && results.resources.length === 0 && (
            <EmptyState icon="🔍" title="No results" message={`Nothing matched "${q}" — try a different course code or title.`} />
          )}
        </>
      )}
    </div>
  );
}
