import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import CourseSelector from '../../components/CourseSelector.jsx';
import AdminResourceListItem from './AdminResourceListItem.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function ManageResources() {
  const { showToast } = useToast();
  const [courseId, setCourseId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('book');
  const [externalLink, setExternalLink] = useState('');
  const [cover, setCover] = useState(null);
  const [error, setError] = useState('');

  const [courseResources, setCourseResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const loadCourseResources = useCallback(() => {
    if (!courseId) return setCourseResources([]);
    setLoadingResources(true);
    api
      .get('/resources', { params: { courseId } })
      .then((res) => setCourseResources(res.data.data))
      .finally(() => setLoadingResources(false));
  }, [courseId]);

  useEffect(() => {
    loadCourseResources();
  }, [loadCourseResources]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!courseId) {
      setError('Pick a course using the selectors above before submitting.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('type', type);
      formData.append('externalLink', externalLink);
      if (cover) formData.append('cover', cover);

      await api.post('/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Resource added', 'success');
      setTitle('');
      setAuthor('');
      setExternalLink('');
      setCover(null);
      loadCourseResources();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add resource');
    }
  };

  return (
    <div>
      <h2>Resources</h2>
      <p className="muted">Pick a course to see what's already there, or add something new to it.</p>

      <div className="card" style={{ maxWidth: 480, marginBottom: 16 }}>
        <CourseSelector onChange={setCourseId} />
      </div>

      {courseId && (
        <div style={{ marginBottom: 24, maxWidth: 480 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Existing resources in this course</h3>
          {loadingResources ? (
            <p className="muted">Loading...</p>
          ) : courseResources.length === 0 ? (
            <EmptyState icon="📕" title="Nothing here yet" message="Add the first resource for this course below." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {courseResources.map((r) => (
                <AdminResourceListItem key={r.id} resource={r} onChanged={loadCourseResources} />
              ))}
            </div>
          )}
        </div>
      )}

      {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={submit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
        <div style={{ fontWeight: 600 }}>Add a resource</div>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="input" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="book">Book</option>
          <option value="lecture_notes">Lecture Notes</option>
          <option value="past_question">Past Question</option>
          <option value="other">Other</option>
        </select>
        <input
          className="input"
          placeholder="External link (URL to the resource)"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
        <button className="btn" type="submit" disabled={!courseId}>
          Add resource
        </button>
      </form>
    </div>
  );
}
