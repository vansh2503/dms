/**
 * DetailRow - Reusable component for displaying label-value pairs in detail modals
 * 
 * @param {string} label - The label text
 * @param {any} value - The value to display
 * @param {function} formatter - Optional formatter function for the value
 */
const DetailRow = ({ label, value, formatter }) => {
  const displayValue = formatter ? formatter(value) : (value ?? '—');
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.625rem 0',
      borderBottom: '1px solid #F1F5F9'
    }}>
      <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500 }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: '#0F172A',
        textAlign: 'right',
        maxWidth: '60%',
        wordBreak: 'break-word'
      }}>
        {displayValue}
      </span>
    </div>
  );
};

export default DetailRow;
