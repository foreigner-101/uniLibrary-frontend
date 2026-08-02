import { Link } from 'react-router-dom';

/**
 * `ancestors` is University-first, NOT including the current page's own
 * entity. `current` is the plain-text label for the page you're on.
 */
export default function Breadcrumbs({ ancestors = [], current }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/universities">Universities</Link>
      {ancestors.map((a) => (
        <span key={a.to}>
          {' / '}
          <Link to={a.to}>{a.label}</Link>
        </span>
      ))}
      {current && <span> / {current}</span>}
    </nav>
  );
}
