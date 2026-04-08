import { Search } from 'lucide-react';

/**
 * SearchBar — consistent search input
 *
 * Props:
 *   value: string
 *   onChange: (value: string) => void
 *   placeholder?: string
 *   className?: string
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-icon" style={{ width: 15, height: 15 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;
