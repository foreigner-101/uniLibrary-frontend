import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/axios';

const TYPE_META = {
  book: { label: 'Book', icon: '📘' },
  lecture_notes: { label: 'Lecture Notes', icon: '📝' },
  past_question: { label: 'Past Questions', icon: '📄' },
  other: { label: 'Other', icon: '📎' },
};

// R2 object URLs are usually a hash/key, not a readable filename — build
// a sensible one from the resource title, keeping the original extension
// so the saved file still opens correctly.
function buildDownloadFilename(resource) {
  const safeTitle = resource.title.replace(/[\\/:*?"<>|]+/g, '').trim() || 'resource';
  try {
    const { pathname } = new URL(resource.externalLink);
    const dot = pathname.lastIndexOf('.');
    const ext = dot !== -1 ? pathname.slice(dot) : '';
    return `${safeTitle}${ext}`;
  } catch {
    return safeTitle;
  }
}

export default function ResourceCard({ resource, onFavoriteChange, isFavorited }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const meta = TYPE_META[resource.type] || TYPE_META.other;

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      if (isFavorited) {
        await api.delete(`/favorites/${resource.id}`);
      } else {
        await api.post('/favorites', { resourceId: resource.id });
      }
      onFavoriteChange?.();
    } catch (err) {
      showToast?.(err.response?.data?.message || 'Something went wrong — try again', 'error');
    }
  };

  return (
    <div className="card resource-card">
      {resource.coverImageUrl ? (
        <img
          src={resource.coverImageUrl}
          alt={resource.title}
          style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
        />
      ) : (
        <div className="resource-cover-placeholder" aria-hidden="true">
          {meta.icon}
        </div>
      )}

      <span className={`resource-type-badge badge-${resource.type || 'other'}`}>{meta.label}</span>
      <div style={{ fontWeight: 600 }}>{resource.title}</div>
      {resource.author && <div className="muted">{resource.author}</div>}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a href={resource.externalLink} target="_blank" rel="noreferrer" className="btn">
            Open
          </a>
          <a
            href={resource.externalLink}
            download={buildDownloadFilename(resource)}
            className="btn secondary"
            aria-label={`Download ${resource.title}`}
          >
            Download
          </a>
        </div>
        {user && (
          <button
            className="btn secondary favorite-btn"
            onClick={toggleFavorite}
            aria-label={isFavorited ? `Remove ${resource.title} from favorites` : `Save ${resource.title} to favorites`}
            aria-pressed={isFavorited}
          >
            {isFavorited ? '★ Saved' : '☆ Save'}
          </button>
        )}
      </div>
    </div>
  );
}
