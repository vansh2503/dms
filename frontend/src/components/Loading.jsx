const Loading = ({ message = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
    <div className="spinner" style={{ marginBottom: '0.875rem' }} />
    <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>{message}</p>
  </div>
);

export default Loading;
