import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container hero">
      <h1 className="hero-title">Find your course materials, fast.</h1>
      <p className="muted" style={{ fontSize: 16, marginBottom: 24 }}>
        Browse textbooks and lecture notes organized by university, programme, and course.
      </p>
      <Link to="/universities" className="btn" style={{ fontSize: 16, padding: '12px 24px' }}>
        Browse Universities
      </Link>
    </div>
  );
}
