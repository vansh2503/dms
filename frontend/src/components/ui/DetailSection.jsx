/**
 * DetailSection - Reusable component for grouping related details with an icon and title
 * 
 * @param {Component} icon - Lucide icon component
 * @param {string} title - Section title
 * @param {ReactNode} children - Section content (typically DetailRow components)
 */
const DetailSection = ({ icon: Icon, title, children }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.625rem'
    }}>
      {Icon && <Icon style={{ width: 15, height: 15, color: '#002C5F' }} />}
      <span style={{
        fontSize: '0.8125rem',
        fontWeight: 700,
        color: '#002C5F',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </span>
    </div>
    <div style={{
      backgroundColor: '#F8FAFC',
      borderRadius: 8,
      padding: '0.75rem 1rem'
    }}>
      {children}
    </div>
  </div>
);

export default DetailSection;
