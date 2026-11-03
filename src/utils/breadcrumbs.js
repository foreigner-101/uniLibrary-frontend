import api from '../api/axios';

const ANCESTOR_CHAIN = {
  university: { endpoint: 'universities', parentField: null, parentType: null, path: (id) => `/universities/${id}` },
  faculty: { endpoint: 'faculties', parentField: 'universityId', parentType: 'university', path: (id) => `/faculties/${id}` },
  programme: { endpoint: 'programmes', parentField: 'facultyId', parentType: 'faculty', path: (id) => `/programmes/${id}` },
  level: { endpoint: 'levels', parentField: 'programmeId', parentType: 'programme', path: (id) => `/levels/${id}` },
  semester: { endpoint: 'semesters', parentField: 'levelId', parentType: 'level', path: (id) => `/semesters/${id}` },
  course: { endpoint: 'courses', parentField: 'semesterId', parentType: 'semester', path: (id) => `/courses/${id}` },
};

/**
 * Walks upward from (type, id) to University, returning an array of
 * { label, to } ancestor crumbs INCLUSIVE of the given node itself
 * (in University-first order). Makes one sequential API call per level
 * — cheap in practice since the hierarchy is at most 6 deep.
 */
export async function buildAncestorTrail(type, id) {
  const trail = [];
  let currentType = type;
  let currentId = id;

  while (currentType && currentId) {
    const cfg = ANCESTOR_CHAIN[currentType];
    const res = await api.get(`/${cfg.endpoint}/${currentId}`);
    const item = res.data.data;
    const label = item.code ? `${item.code} — ${item.name}` : item.name;
    trail.unshift({ label, to: cfg.path(currentId) });

    if (cfg.parentField) {
      currentId = item[cfg.parentField];
      currentType = cfg.parentType;
    } else {
      currentType = null;
    }
  }

  return trail;
}
