import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, CheckCircle2, X, Plus } from 'lucide-react';

/**
 * SearchableSelect - Reusable search dropdown component
 * 
 * @param {string} label - Field label
 * @param {boolean} required - Is field required
 * @param {function} queryFn - Function to fetch search results
 * @param {string} queryKey - React Query key
 * @param {function} onSelect - Callback when item selected
 * @param {function} renderItem - Function to render each result item
 * @param {function} renderSelected - Function to render selected item chip
 * @param {string} placeholder - Input placeholder
 * @param {number} minSearchLength - Minimum characters to trigger search (default: 3)
 * @param {function} onAddNew - Callback when "Add New" is clicked (optional)
 * @param {string} addNewLabel - Label for "Add New" button (optional)
 * @param {object} preselectedItem - Item to preselect (optional)
 */
const SearchableSelect = ({
  label,
  required = false,
  queryFn,
  queryKey,
  onSelect,
  renderItem,
  renderSelected,
  placeholder = 'Search...',
  minSearchLength = 3,
  error,
  onAddNew,
  addNewLabel = '+ Add New',
  preselectedItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(preselectedItem || null);
  const [showResults, setShowResults] = useState(false);

  // Update selected item when preselectedItem changes
  useEffect(() => {
    if (preselectedItem) {
      setSelectedItem(preselectedItem);
    }
  }, [preselectedItem]);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, searchTerm],
    queryFn: () => queryFn(searchTerm),
    enabled: searchTerm.length >= minSearchLength
  });

  const results = data?.data || [];

  const handleSelect = (item) => {
    setSelectedItem(item);
    setShowResults(false);
    onSelect(item);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setSearchTerm('');
    onSelect(null);
  };

  const handleAddNew = () => {
    setShowResults(false);
    if (onAddNew) {
      onAddNew();
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      
      {!selectedItem ? (
        <div style={{ position: 'relative' }}>
          <Search style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 15,
            height: 15,
            color: '#94A3B8',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className={`input-field ${error ? 'is-invalid' : ''}`}
            style={{ paddingLeft: '2rem' }}
            placeholder={placeholder}
          />
          
          {showResults && searchTerm.length >= minSearchLength && (
            <div className="search-results-dropdown">
              {isLoading ? (
                <div style={{ padding: '0.75rem', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
                  Searching...
                </div>
              ) : (
                <>
                  {results.length === 0 ? (
                    <div style={{ padding: '0.75rem', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
                      No results found
                    </div>
                  ) : (
                    results.map((item, idx) => (
                      <div
                        key={idx}
                        className="search-result-item"
                        onClick={() => handleSelect(item)}
                      >
                        {renderItem(item)}
                      </div>
                    ))
                  )}
                  
                  {/* Add New Button */}
                  {onAddNew && (
                    <div
                      className="search-result-item"
                      onClick={handleAddNew}
                      style={{
                        borderTop: results.length > 0 ? '1px solid #E2E8F0' : 'none',
                        color: '#002C5F',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus style={{ width: 16, height: 16 }} />
                      {addNewLabel}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="selected-chip">
          <CheckCircle2 style={{ width: 16, height: 16 }} />
          {renderSelected(selectedItem)}
          <button
            type="button"
            onClick={handleClear}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X style={{ width: 14, height: 14, color: '#15803D' }} />
          </button>
        </div>
      )}
      
      {error && <p className="form-error"><span>{error}</span></p>}
    </div>
  );
};

export default SearchableSelect;
