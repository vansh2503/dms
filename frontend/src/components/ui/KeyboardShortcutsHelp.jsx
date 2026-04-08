import { Keyboard } from 'lucide-react';
import Modal from '../Modal';

/**
 * KeyboardShortcutsHelp Component - Display available keyboard shortcuts
 */
const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Quick search' },
    { keys: ['Ctrl', 'N'], description: 'Create new item' },
    { keys: ['Ctrl', 'S'], description: 'Save form' },
    { keys: ['Esc'], description: 'Close modal/dialog' },
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Delete'], description: 'Delete selected item' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Keyboard style={{ width: 20, height: 20, color: '#1D4ED8' }} />
          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
            Use these shortcuts to navigate faster
          </p>
        </div>

        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 0.75rem',
              backgroundColor: '#F9FAFB',
              borderRadius: 6,
              border: '1px solid #E5E7EB'
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              {shortcut.description}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {shortcut.keys.map((key, i) => (
                <kbd
                  key={i}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: 4,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    fontFamily: 'monospace'
                  }}
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#EFF6FF', borderRadius: 6, border: '1px solid #BFDBFE' }}>
          <p style={{ fontSize: '0.75rem', color: '#1D4ED8', lineHeight: 1.5 }}>
            💡 Tip: Press <kbd style={{ padding: '0.125rem 0.375rem', backgroundColor: '#FFFFFF', border: '1px solid #93C5FD', borderRadius: 3, fontFamily: 'monospace' }}>Ctrl</kbd> + <kbd style={{ padding: '0.125rem 0.375rem', backgroundColor: '#FFFFFF', border: '1px solid #93C5FD', borderRadius: 3, fontFamily: 'monospace' }}>/</kbd> anytime to view this help
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsHelp;
