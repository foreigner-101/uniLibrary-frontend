import { useEffect, useState } from 'react';

/**
 * One rung of the hierarchy ladder. Shows a dropdown of existing items
 * (scoped to whatever the parent selection is), a small "add new" form
 * that doubles as an "edit selected" form, and delete/edit buttons for
 * the currently selected item.
 *
 * `fields` describes the form: [{ name, placeholder, required }] — field
 * `name` must match the corresponding property on the item object, since
 * it's used both to build create payloads and to prefill the edit form.
 * `renderLabel` formats how an item appears in the dropdown.
 */
export default function HierarchyPanel({
  title,
  items,
  selectedId,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
  fields,
  renderLabel,
  disabled,
  canDelete = () => true,
}) {
  const emptyForm = () => Object.fromEntries(fields.map((f) => [f.name, '']));
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedId);
  const allowedToModify = selectedItem && canDelete(selectedItem);

  // Selection changed out from under an open edit form — bail out of edit mode.
  useEffect(() => {
    setEditing(false);
    setError('');
  }, [selectedId]);

  const startEdit = () => {
    if (!selectedItem) return;
    setForm(Object.fromEntries(fields.map((f) => [f.name, selectedItem[f.name] ?? ''])));
    setEditing(true);
    setError('');
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(emptyForm());
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await onUpdate(selectedId, form);
        setEditing(false);
      } else {
        await onCreate(form);
      }
      setForm(emptyForm());
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editing ? 'update' : 'add'} ${title.toLowerCase()}`);
    }
  };

  return (
    <div className="card" style={{ opacity: disabled ? 0.5 : 1 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>

      <div className="hierarchy-select-row">
        <select
          className="input"
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value || null)}
          disabled={disabled}
        >
          <option value="">Select {title.toLowerCase()}...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {renderLabel(item)}
            </option>
          ))}
        </select>
        {selectedId && allowedToModify && !editing && (
          <button type="button" className="btn secondary" onClick={startEdit} disabled={disabled}>
            Edit
          </button>
        )}
        {selectedId && allowedToModify && (
          <button
            type="button"
            className="btn danger"
            onClick={() => onDelete(selectedId)}
            disabled={disabled}
            aria-label={`Delete ${renderLabel(selectedItem)}`}
          >
            Delete
          </button>
        )}
      </div>

      {selectedId && !allowedToModify && (
        <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
          You can only edit or delete {title.toLowerCase()} entries you created yourself.
        </div>
      )}

      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{error}</div>}

      {editing && (
        <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
          Editing "{renderLabel(selectedItem)}"
        </div>
      )}

      <form onSubmit={submit} className="hierarchy-form-row">
        {fields.map((f) => (
          <input
            key={f.name}
            className="input"
            placeholder={f.placeholder}
            value={form[f.name]}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            required={f.required}
            disabled={disabled}
          />
        ))}
        <button className="btn" type="submit" disabled={disabled}>
          {editing ? 'Save changes' : 'Add'}
        </button>
        {editing && (
          <button type="button" className="btn secondary" onClick={cancelEdit} disabled={disabled}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
