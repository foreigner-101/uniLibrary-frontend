import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import HierarchyPanel from '../../components/HierarchyPanel.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useConfirm } from '../../context/ConfirmContext.jsx';

export default function ManageStructure() {
  const { user, isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const confirmAction = useConfirm();
  const canDelete = (item) => isSuperAdmin || item.createdById === user?.id;

  const [universities, setUniversities] = useState([]);
  const [universityId, setUniversityId] = useState(null);

  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState(null);

  const [programmes, setProgrammes] = useState([]);
  const [programmeId, setProgrammeId] = useState(null);

  const [levels, setLevels] = useState([]);
  const [levelId, setLevelId] = useState(null);

  const [semesters, setSemesters] = useState([]);
  const [semesterId, setSemesterId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);

  const loadUniversities = useCallback(() => {
    api.get('/universities').then((res) => setUniversities(res.data.data));
  }, []);

  const loadFaculties = useCallback((uid) => {
    if (!uid) return setFaculties([]);
    api.get(`/universities/${uid}`).then((res) => setFaculties(res.data.data.faculties));
  }, []);

  const loadProgrammes = useCallback((fid) => {
    if (!fid) return setProgrammes([]);
    api.get(`/faculties/${fid}`).then((res) => setProgrammes(res.data.data.programmes));
  }, []);

  const loadLevels = useCallback((pid) => {
    if (!pid) return setLevels([]);
    api.get(`/programmes/${pid}`).then((res) => setLevels(res.data.data.levels));
  }, []);

  const loadSemesters = useCallback((lid) => {
    if (!lid) return setSemesters([]);
    api.get(`/levels/${lid}`).then((res) => setSemesters(res.data.data.semesters));
  }, []);

  const loadCourses = useCallback((sid) => {
    if (!sid) return setCourses([]);
    api.get(`/semesters/${sid}`).then((res) => setCourses(res.data.data.courses));
  }, []);

  useEffect(() => { loadUniversities(); }, [loadUniversities]);

  const selectUniversity = (id) => {
    setUniversityId(id);
    setFacultyId(null); setProgrammeId(null); setLevelId(null); setSemesterId(null);
    setProgrammes([]); setLevels([]); setSemesters([]); setCourses([]);
    loadFaculties(id);
  };
  const selectFaculty = (id) => {
    setFacultyId(id);
    setProgrammeId(null); setLevelId(null); setSemesterId(null);
    setLevels([]); setSemesters([]); setCourses([]);
    loadProgrammes(id);
  };
  const selectProgramme = (id) => {
    setProgrammeId(id);
    setLevelId(null); setSemesterId(null);
    setSemesters([]); setCourses([]);
    loadLevels(id);
  };
  const selectLevel = (id) => {
    setLevelId(id);
    setSemesterId(null);
    setCourses([]);
    loadSemesters(id);
  };
  const selectSemester = (id) => {
    setSemesterId(id);
    setCourseId(null);
    loadCourses(id);
  };

  // Shared delete flow: confirm -> call -> toast -> refresh. Keeps each
  // panel's onDelete a one-liner instead of repeating this five times.
  const doDelete = async ({ message, request, afterSelect, refresh, label }) => {
    const ok = await confirmAction({ title: `Delete this ${label}?`, message });
    if (!ok) return;
    try {
      await request();
      afterSelect(null);
      refresh();
      showToast(`${label[0].toUpperCase()}${label.slice(1)} deleted`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div>
      <h2>Manage Structure</h2>
      <p className="muted">
        Build the hierarchy top-down: pick or add a university, then a faculty within it, and so on
        down to courses. Resources are added separately under "Resources".
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
        <HierarchyPanel
          title="University"
          items={universities}
          selectedId={universityId}
          onSelect={selectUniversity}
          onCreate={async (form) => {
            await api.post('/universities', { name: form.name, country: form.country });
            loadUniversities();
            showToast('University added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/universities/${id}`, { name: form.name, country: form.country });
            loadUniversities();
            showToast('University updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'university',
              message: 'This deletes everything under it — faculties, programmes, courses, and resources.',
              request: () => api.delete(`/universities/${id}`),
              afterSelect: selectUniversity,
              refresh: loadUniversities,
            })
          }
          fields={[
            { name: 'name', placeholder: 'University name', required: true },
            { name: 'country', placeholder: 'Country' },
          ]}
          renderLabel={(u) => u.name}
          canDelete={canDelete}
        />

        <HierarchyPanel
          title="Faculty"
          items={faculties}
          selectedId={facultyId}
          onSelect={selectFaculty}
          onCreate={async (form) => {
            await api.post('/faculties', { name: form.name, universityId });
            loadFaculties(universityId);
            showToast('Faculty added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/faculties/${id}`, { name: form.name });
            loadFaculties(universityId);
            showToast('Faculty updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'faculty',
              message: 'This deletes everything under it — programmes, courses, and resources.',
              request: () => api.delete(`/faculties/${id}`),
              afterSelect: selectFaculty,
              refresh: () => loadFaculties(universityId),
            })
          }
          fields={[{ name: 'name', placeholder: 'Faculty name', required: true }]}
          renderLabel={(f) => f.name}
          canDelete={canDelete}
          disabled={!universityId}
        />

        <HierarchyPanel
          title="Programme"
          items={programmes}
          selectedId={programmeId}
          onSelect={selectProgramme}
          onCreate={async (form) => {
            await api.post('/programmes', { name: form.name, facultyId });
            loadProgrammes(facultyId);
            showToast('Programme added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/programmes/${id}`, { name: form.name });
            loadProgrammes(facultyId);
            showToast('Programme updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'programme',
              message: 'This deletes everything under it — levels, courses, and resources.',
              request: () => api.delete(`/programmes/${id}`),
              afterSelect: selectProgramme,
              refresh: () => loadProgrammes(facultyId),
            })
          }
          fields={[{ name: 'name', placeholder: 'Programme name', required: true }]}
          renderLabel={(p) => p.name}
          canDelete={canDelete}
          disabled={!facultyId}
        />

        <HierarchyPanel
          title="Level"
          items={levels}
          selectedId={levelId}
          onSelect={selectLevel}
          onCreate={async (form) => {
            await api.post('/levels', { name: form.name, programmeId });
            loadLevels(programmeId);
            showToast('Level added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/levels/${id}`, { name: form.name });
            loadLevels(programmeId);
            showToast('Level updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'level',
              message: 'This deletes everything under it — semesters, courses, and resources.',
              request: () => api.delete(`/levels/${id}`),
              afterSelect: selectLevel,
              refresh: () => loadLevels(programmeId),
            })
          }
          fields={[{ name: 'name', placeholder: 'e.g. 100, 200', required: true }]}
          renderLabel={(l) => `Level ${l.name}`}
          canDelete={canDelete}
          disabled={!programmeId}
        />

        <HierarchyPanel
          title="Semester"
          items={semesters}
          selectedId={semesterId}
          onSelect={selectSemester}
          onCreate={async (form) => {
            await api.post('/semesters', { name: form.name, levelId });
            loadSemesters(levelId);
            showToast('Semester added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/semesters/${id}`, { name: form.name });
            loadSemesters(levelId);
            showToast('Semester updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'semester',
              message: 'This deletes everything under it — courses and resources.',
              request: () => api.delete(`/semesters/${id}`),
              afterSelect: selectSemester,
              refresh: () => loadSemesters(levelId),
            })
          }
          fields={[{ name: 'name', placeholder: 'e.g. First Semester', required: true }]}
          renderLabel={(s) => s.name}
          canDelete={canDelete}
          disabled={!levelId}
        />

        <HierarchyPanel
          title="Course"
          items={courses}
          selectedId={courseId}
          onSelect={setCourseId}
          onCreate={async (form) => {
            await api.post('/courses', { code: form.code, name: form.name, semesterId });
            loadCourses(semesterId);
            showToast('Course added', 'success');
          }}
          onUpdate={async (id, form) => {
            await api.patch(`/courses/${id}`, { code: form.code, name: form.name });
            loadCourses(semesterId);
            showToast('Course updated', 'success');
          }}
          onDelete={(id) =>
            doDelete({
              label: 'course',
              message: 'This deletes all resources listed under it.',
              request: () => api.delete(`/courses/${id}`),
              afterSelect: setCourseId,
              refresh: () => loadCourses(semesterId),
            })
          }
          fields={[
            { name: 'code', placeholder: 'Course code, e.g. CENG301', required: true },
            { name: 'name', placeholder: 'Course name', required: true },
          ]}
          renderLabel={(c) => `${c.code} — ${c.name}`}
          canDelete={canDelete}
          disabled={!semesterId}
        />
      </div>
    </div>
  );
}
