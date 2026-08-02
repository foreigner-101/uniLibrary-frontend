import { useEffect, useState } from 'react';
import api from '../api/axios';

/**
 * Replaces "paste a Course ID" with a guided University -> Faculty ->
 * Programme -> Level -> Semester -> Course picker. Calls onChange(courseId)
 * with the selected course's id (or null while incomplete).
 */
export default function CourseSelector({ onChange }) {
  const [universities, setUniversities] = useState([]);
  const [universityId, setUniversityId] = useState('');

  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState('');

  const [programmes, setProgrammes] = useState([]);
  const [programmeId, setProgrammeId] = useState('');

  const [levels, setLevels] = useState([]);
  const [levelId, setLevelId] = useState('');

  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState('');

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    api.get('/universities').then((res) => setUniversities(res.data.data));
  }, []);

  useEffect(() => {
    setFaculties([]);
    setFacultyId('');
    if (!universityId) return;
    api.get(`/universities/${universityId}`).then((res) => setFaculties(res.data.data.faculties));
  }, [universityId]);

  useEffect(() => {
    setProgrammes([]);
    setProgrammeId('');
    if (!facultyId) return;
    api.get(`/faculties/${facultyId}`).then((res) => setProgrammes(res.data.data.programmes));
  }, [facultyId]);

  useEffect(() => {
    setLevels([]);
    setLevelId('');
    if (!programmeId) return;
    api.get(`/programmes/${programmeId}`).then((res) => setLevels(res.data.data.levels));
  }, [programmeId]);

  useEffect(() => {
    setSemesters([]);
    setSemesterId('');
    if (!levelId) return;
    api.get(`/levels/${levelId}`).then((res) => setSemesters(res.data.data.semesters));
  }, [levelId]);

  useEffect(() => {
    setCourses([]);
    setCourseId('');
    if (!semesterId) return;
    api.get(`/semesters/${semesterId}`).then((res) => setCourses(res.data.data.courses));
  }, [semesterId]);

  useEffect(() => {
    onChange(courseId || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const selectStyle = { marginBottom: 8 };

  return (
    <div>
      <select className="input" style={selectStyle} value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
        <option value="">Select university...</option>
        {universities.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select className="input" style={selectStyle} value={facultyId} onChange={(e) => setFacultyId(e.target.value)} disabled={!universityId}>
        <option value="">Select faculty...</option>
        {faculties.map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>

      <select className="input" style={selectStyle} value={programmeId} onChange={(e) => setProgrammeId(e.target.value)} disabled={!facultyId}>
        <option value="">Select programme...</option>
        {programmes.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select className="input" style={selectStyle} value={levelId} onChange={(e) => setLevelId(e.target.value)} disabled={!programmeId}>
        <option value="">Select level...</option>
        {levels.map((l) => (
          <option key={l.id} value={l.id}>Level {l.name}</option>
        ))}
      </select>

      <select className="input" style={selectStyle} value={semesterId} onChange={(e) => setSemesterId(e.target.value)} disabled={!levelId}>
        <option value="">Select semester...</option>
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select className="input" style={selectStyle} value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={!semesterId}>
        <option value="">Select course...</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
        ))}
      </select>
    </div>
  );
}
