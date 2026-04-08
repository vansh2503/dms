import { useEffect } from 'react';

/**
 * Hook for registering keyboard shortcuts
 * 
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @param {boolean} enabled - Enable/disable shortcuts (default: true)
 * 
 * Example:
 * useKeyboardShortcuts({
 *   'ctrl+k': () => openSearch(),
 *   'ctrl+n': () => openNewForm(),
 *   'escape': () => closeModal()
 * });
 */
export const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Build key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      if (event.metaKey) keys.push('meta');
      
      const key = event.key.toLowerCase();
      if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
        keys.push(key);
      }
      
      const combination = keys.join('+');
      
      // Check if this combination has a handler
      const handler = shortcuts[combination];
      if (handler) {
        // Prevent default browser behavior
        event.preventDefault();
        event.stopPropagation();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

/**
 * Common keyboard shortcuts
 */
export const SHORTCUTS = {
  SEARCH: 'ctrl+k',
  NEW: 'ctrl+n',
  SAVE: 'ctrl+s',
  CLOSE: 'escape',
  REFRESH: 'ctrl+r',
  HELP: 'ctrl+/',
  DELETE: 'delete'
};
