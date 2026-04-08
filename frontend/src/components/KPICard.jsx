import { TrendingUp, TrendingDown } from 'lucide-react';

const ICON_COLORS = {
  blue:   { bg: '#EFF6FF', color: '#1D4ED8' },
  green:  { bg: '#F0FDF4', color: '#15803D' },
  purple: { bg: '#F5F3FF', color: '#7C3AED' },
  orange: { bg: '#FFF7ED', color: '#C2410C' },
  red:    { bg: '#FEF2F2', color: '#DC2626' },
  indigo: { bg: '#EEF2FF', color: '#4338CA' },
  cyan:   { bg: '#ECFEFF', color: '#0E7490' },
};

const KPICard = ({ title, value, icon: Icon, color = 'blue', trend, trendValue, loading }) => {
  const colors = ICON_COLORS[color] || ICON_COLORS.blue;

  if (loading) {
    return (
      <div className="kpi-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-7 w-16" />
          </div>
          <div className="skeleton w-10 h-10 rounded-lg" />
        </div>
        <div className="section-divider" style={{ margin: '0.75rem 0 0.5rem' }} />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="kpi-card card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value mt-1">{value}</p>
        </div>
        <div
          className="kpi-icon-wrap flex-shrink-0 ml-3"
          style={{ backgroundColor: colors.bg }}
        >
          <Icon style={{ width: 18, height: 18, color: colors.color }} />
        </div>
      </div>

      {trend && (
        <>
          <div className="section-divider" style={{ margin: '0.75rem 0 0.5rem' }} />
          <div className={`kpi-trend ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend === 'up'
              ? <TrendingUp style={{ width: 13, height: 13 }} />
              : <TrendingDown style={{ width: 13, height: 13 }} />
            }
            <span>{trendValue}</span>
            <span className="text-gray-400 font-normal ml-1">vs last period</span>
          </div>
        </>
      )}
    </div>
  );
};

export default KPICard;
