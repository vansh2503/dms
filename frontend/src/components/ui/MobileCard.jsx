/**
 * MobileCard - Mobile-optimized card view for table data
 * 
 * @param {Array} fields - Field definitions: [{ label, value, render }]
 * @param {ReactNode} actions - Action buttons
 * @param {function} onClick - Card click handler
 */
const MobileCard = ({ fields = [], actions, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '1rem',
        marginBottom: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s'
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.boxShadow = '0 4px 12px 0 rgb(0 0 0 / 0.08)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.boxShadow = 'none')}
    >
      {fields.map((field, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0.5rem 0',
            borderBottom: idx < fields.length - 1 ? '1px solid #F1F5F9' : 'none'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {field.label}
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
            {field.render ? field.render() : field.value}
          </span>
        </div>
      ))}
      
      {actions && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #F1F5F9',
          flexWrap: 'wrap'
        }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default MobileCard;
