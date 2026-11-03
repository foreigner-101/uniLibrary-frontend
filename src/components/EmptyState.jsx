export default function EmptyState({ icon = '📭', title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">{icon}</div>
      {title && <div className="empty-state-title">{title}</div>}
      {message && <div>{message}</div>}
    </div>
  );
}
