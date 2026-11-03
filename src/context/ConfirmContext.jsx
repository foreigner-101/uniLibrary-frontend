import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolver = useRef(null);

  const confirmAction = useCallback(({ title = 'Are you sure?', message = '', danger = true } = {}) => {
    setDialog({ title, message, danger });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const respond = (result) => {
    setDialog(null);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirmAction}>
      {children}
      {dialog && (
        <div className="modal-backdrop" onClick={() => respond(false)}>
          <div className="modal-dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{dialog.title}</div>
            {dialog.message && <div className="modal-message">{dialog.message}</div>}
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => respond(false)}>
                Cancel
              </button>
              <button className={dialog.danger ? 'btn danger' : 'btn'} onClick={() => respond(true)} autoFocus>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
