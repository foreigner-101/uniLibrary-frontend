import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConfirm } from '../../context/ConfirmContext.jsx';

const TYPE_LABEL = {
  book: 'Book',
  lecture_notes: 'Lecture Notes',
  past_question: 'Past Question',
  other: 'Other',
};

export default function AdminResourceListItem({ resource, onChanged }) {
  const { user, isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const confirmAction = useConfirm();

  const canModify = isSuperAdmin || resource.addedById === user?.id;

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(resource.title);
  const [author, setAuthor] = useState(resource.author || '');
  const [type, setType] = useState(resource.type || 'book');
  const [externalLink, setExternalLink] = useState(resource.externalLink);
  const [cover, setCover] = useState(null);
  const [error, setError] = useState('');

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    setTitle(resource.title);
    setAuthor(resource.author || '');
    setType(resource.type || 'book');
    setExternalLink(resource.externalLink);
    setCover(null);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('type', type);
      formData.append('externalLink', externalLink);
      if (cover) formData.append('cover', cover);

      await api.patch(`/resources/${resource.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Resource updated', 'success');
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update resource');
    }
  };

  const remove = async () => {
    const ok = await confirmAction({
      title: 'Delete this resource?',
      message: `"${resource.title}" will be permanently removed.`,
    });
    if (!ok) return;
    try {
      await api.delete(`/resources/${resource.id}`);
      showToast('Resource deleted', 'success');
      onChanged();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  if (editing) {
    return (
      <form onSubmit={save} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {error && <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>}
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="input" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="book">Book</option>
          <option value="lecture_notes">Lecture Notes</option>
          <option value="past_question">Past Question</option>
          <option value="other">Other</option>
        </select>
        <input className="input" placeholder="External link" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} required />
        <div>
          <label className="muted" style={{ fontSize: 13 }}>Replace cover image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files[0])} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit">Save changes</button>
          <button className="btn secondary" type="button" onClick={cancelEdit}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <div>
        <span className={`resource-type-badge badge-${resource.type || 'other'}`}>
          {TYPE_LABEL[resource.type] || 'Other'}
        </span>
        <div style={{ fontWeight: 600 }}>{resource.title}</div>
        {resource.author && <div className="muted">{resource.author}</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {canModify ? (
          <>
            <button className="btn secondary" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn danger" onClick={remove} aria-label={`Delete ${resource.title}`}>Delete</button>
          </>
        ) : (
          <span className="muted" style={{ fontSize: 13 }}>Added by someone else</span>
        )}
      </div>
    </div>
  );
}
