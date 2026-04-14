import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Download, FileText, Filter, X } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/Badge';
import { downloadCSV } from '../utils/helpers';

const CHART_COLORS = ['#002C5F', '#00AAD2', '#0E4C92', '#64748B', '#94A3B8', '#CBD5E1'];

const fmt = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const MetricBox = ({ label, value, color, textColor }) => (
  <div style={{ backgroundColor: color || '#EFF6FF', borderRadius: 8, padding: '0.875rem 1rem', border: '1px solid rgba(0,0,0,0.06)' }}>
    <p style={{ fontSize: '0.75rem', fontWeight: 500, color: textColor || '#1D4ED8', opacity: 0.8, marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: '1.375rem', fontWeight: 700, color: textColor || '#1D4ED8', lineHeight: 1 }}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '1rem' }}>
    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>{title}</p>
    {children}
  </div>
);

const LoadingBlock = () => (
  <div className="flex-center" style={{ padding: '3rem 0' }}><div className="spinner" /></div>
);

const EmptyBlock = ({ message }) => (
  <div className="table-empty" style={{ padding: '3rem 0' }}>
    <p className="text-sm font-medium">{message || 'No data available for the selected period'}</p>
  </div>
);

const TT = {
  contentStyle: { borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 4px 12px rgb(0 0 0/0.1)' },
};

const TABS = [
  { id: 'sales',     label: 'Sales Summary' },
  { id: 'inventory', label: 'Inventory Status' },
  { id: 'dispatch',  label: 'Dispatch Summary' },
  { id: 'booking',   label: 'Booking Analysis' },
  { id: 'models',    label: 'Top Models' },
];



const Reports = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const [activeTab, setActiveTab] = useState('sales');
  const [showFilters, setShowFilters] = useState(true);
  const [dateError, setDateError] = useState('');
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    dealershipId: isSuperAdmin ? '' : (user?.dealershipId ?? ''),
  });

  const { data: dealershipsData } = useQuery({
    queryKey: ['dealerships-list'],
    queryFn: () => adminService.getAllDealerships(),
    enabled: isSuperAdmin,
  });
  const dealerships = dealershipsData?.data || [];

  const handleFilterChange = (key, value) => {
    setDateError('');
    const next = { ...filters, [key]: value };
    if (next.fromDate && next.toDate && next.fromDate > next.toDate) {
      setDateError('From date must be before To date');
      return;
    }
    setFilters(next);
  };

  const clearFilters = () => {
    setDateError('');
    setFilters({ fromDate: '', toDate: '', dealershipId: isSuperAdmin ? '' : (user?.dealershipId ?? '') });
  };

  const qp = {};
  if (filters.fromDate)    qp.fromDate     = filters.fromDate;
  if (filters.toDate)      qp.toDate       = filters.toDate;
  if (filters.dealershipId) qp.dealershipId = filters.dealershipId;

  const { data: salesData,     isLoading: salesLoading }     = useQuery({ queryKey: ['rpt-sales',     qp], queryFn: () => reportService.getSalesSummary(qp),    enabled: activeTab === 'sales' });
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({ queryKey: ['rpt-inventory', qp], queryFn: () => reportService.getInventoryStatus(qp), enabled: activeTab === 'inventory' });
  const { data: dispatchData,  isLoading: dispatchLoading }  = useQuery({ queryKey: ['rpt-dispatch',  qp], queryFn: () => reportService.getDispatchSummary(qp), enabled: activeTab === 'dispatch' });
  const { data: bookingData,   isLoading: bookingLoading }   = useQuery({ queryKey: ['rpt-booking',   qp], queryFn: () => reportService.getBookingAnalysis(qp), enabled: activeTab === 'booking' });
  const { data: modelsData,    isLoading: modelsLoading }    = useQuery({ queryKey: ['rpt-models',    qp], queryFn: () => reportService.getTopModels(qp),        enabled: activeTab === 'models' });

  const handleExportCSV = () => {
    const map = {
      sales:     salesData?.data?.monthlySales,
      inventory: inventoryData?.data?.distribution,
      dispatch:  dispatchData?.data?.monthlyDispatch,
      booking:   bookingData?.data?.statusDistribution,
      models:    modelsData?.data?.models,
    };
    downloadCSV(map[activeTab], activeTab + '-report-' + new Date().toISOString().slice(0, 10) + '.csv');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader title="Reports & Analytics" subtitle={isSuperAdmin ? 'All Dealerships' : user?.dealershipName}>
        <button onClick={() => window.print()} className="btn btn-secondary btn-sm no-print">
          <FileText style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
        <button onClick={handleExportCSV} className="btn btn-success btn-sm no-print">
          <Download style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </PageHeader>

      {/* Filters */}
      <div className="filter-container no-print">
        <div className="filter-header">
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Filters</p>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-ghost btn-sm">
            <Filter style={{ width: 13, height: 13 }} />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
        {showFilters && (
          <div className="filter-grid">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input type="date" className="input-field" value={filters.fromDate} max={filters.toDate || undefined} onChange={(e) => handleFilterChange('fromDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input type="date" className="input-field" value={filters.toDate} min={filters.fromDate || undefined} onChange={(e) => handleFilterChange('toDate', e.target.value)} />
            </div>
            {isSuperAdmin && (
              <div className="form-group">
                <label className="form-label">Dealership</label>
                <select className="form-select" value={filters.dealershipId} onChange={(e) => handleFilterChange('dealershipId', e.target.value)}>
                  <option value="">All Dealerships</option>
                  {dealerships.map((d) => (
                    <option key={d.dealershipId} value={d.dealershipId}>{d.dealershipName}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', gap: '0.25rem' }}>
              <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <X style={{ width: 13, height: 13 }} /> Clear
              </button>
              {dateError && <p style={{ fontSize: '0.75rem', color: '#DC2626' }}>{dateError}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '0 1rem' }} className="tabs-bar no-print">
          {TABS.map((tab) => (
            <button key={tab.id} className={'tab-btn' + (activeTab === tab.id ? ' active' : '')} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.25rem' }}>

          {/* Sales Summary */}
          {activeTab === 'sales' && (
            salesLoading ? <LoadingBlock /> : !salesData?.data ? <EmptyBlock /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  <MetricBox label="Total Revenue"  value={fmt(salesData.data.totalSales)}   color="#EFF6FF" textColor="#1D4ED8" />
                  <MetricBox label="Units Sold"     value={salesData.data.unitsSold ?? 0}    color="#F0FDF4" textColor="#15803D" />
                  <MetricBox label="Avg Sale Value" value={fmt(salesData.data.avgSaleValue)} color="#F5F3FF" textColor="#7C3AED" />
                  <MetricBox
                    label="Revenue Growth"
                    value={(salesData.data.growth >= 0 ? '+' : '') + (salesData.data.growth ?? 0) + '%'}
                    color={salesData.data.growth >= 0 ? '#F0FDF4' : '#FEF2F2'}
                    textColor={salesData.data.growth >= 0 ? '#15803D' : '#DC2626'}
                  />
                </div>
                {salesData.data.monthlySales?.length > 0 ? (
                  <>
                    <ChartCard title="Monthly Sales Trend">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={salesData.data.monthlySales} barCategoryGap="35%">
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => '₹' + (v / 100000).toFixed(0) + 'L'} />
                          <Tooltip formatter={(v, name) => name === 'Sales Amount' ? fmt(v) : v} contentStyle={TT.contentStyle} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="sales" fill="#002C5F" name="Sales Amount" radius={[4,4,0,0]} />
                          <Bar dataKey="units" fill="#00AAD2" name="Units Sold"   radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Month</th><th>Revenue</th><th>Units</th><th>Avg Value</th></tr></thead>
                        <tbody>
                          {salesData.data.monthlySales.map((item, i) => (
                            <tr key={i}>
                              <td className="td-primary">{item.month}</td>
                              <td>{fmt(item.sales)}</td>
                              <td>{item.units}</td>
                              <td>{fmt(item.avgValue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : <EmptyBlock message="No sales data for selected period" />}
              </div>
            )
          )}

          {/* Inventory Status */}
          {activeTab === 'inventory' && (
            inventoryLoading ? <LoadingBlock /> : !inventoryData?.data ? <EmptyBlock /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <MetricBox label="Total Vehicles" value={inventoryData.data.totalVehicles ?? 0} color="#EFF6FF" textColor="#1D4ED8" />
                  <MetricBox label="In Showroom"    value={inventoryData.data.inShowroom ?? 0}    color="#F0FDF4" textColor="#15803D" />
                  <MetricBox label="In Stockyard"   value={inventoryData.data.inStockyard ?? 0}   color="#F5F3FF" textColor="#7C3AED" />
                  <MetricBox label="Booked"         value={inventoryData.data.booked ?? 0}        color="#FFFBEB" textColor="#B45309" />
                  <MetricBox label="In Transit"     value={inventoryData.data.inTransit ?? 0}     color="#FEF2F2" textColor="#DC2626" />
                </div>
                {inventoryData.data.distribution?.length > 0 && (
                  <>
                    <ChartCard title="Inventory Distribution">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={inventoryData.data.distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => name + ' ' + (percent*100).toFixed(0) + '%'} labelLine={false}>
                            {inventoryData.data.distribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TT.contentStyle} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
                        <tbody>
                          {inventoryData.data.distribution.map((item, i) => (
                            <tr key={i}>
                              <td className="td-primary">{item.name}</td>
                              <td>{item.value}</td>
                              <td>{inventoryData.data.totalVehicles > 0 ? ((item.value / inventoryData.data.totalVehicles) * 100).toFixed(1) : 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )
          )}

          {/* Dispatch Summary */}
          {activeTab === 'dispatch' && (
            dispatchLoading ? <LoadingBlock /> : !dispatchData?.data ? <EmptyBlock /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <MetricBox label="Total Dispatched" value={dispatchData.data.totalDispatched ?? 0} color="#EFF6FF" textColor="#1D4ED8" />
                  <MetricBox label="On Time"          value={dispatchData.data.onTime ?? 0}          color="#F0FDF4" textColor="#15803D" />
                  <MetricBox label="Delayed"          value={dispatchData.data.delayed ?? 0}         color="#FFF7ED" textColor="#C2410C" />
                  <MetricBox label="Pending Delivery" value={dispatchData.data.pending ?? 0}         color="#F5F3FF" textColor="#7C3AED" />
                </div>
                {dispatchData.data.monthlyDispatch?.length > 0 ? (
                  <ChartCard title="Monthly Dispatch Trend">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={dispatchData.data.monthlyDispatch} barCategoryGap="35%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={TT.contentStyle} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="dispatched" fill="#002C5F" name="Dispatched" radius={[4,4,0,0]} />
                        <Bar dataKey="delayed"    fill="#F59E0B" name="Delayed"    radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                ) : <EmptyBlock message="No dispatch data for selected period" />}
              </div>
            )
          )}

          {/* Booking Analysis */}
          {activeTab === 'booking' && (
            bookingLoading ? <LoadingBlock /> : !bookingData?.data ? <EmptyBlock /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <MetricBox label="Total Bookings" value={bookingData.data.totalBookings ?? 0} color="#EFF6FF" textColor="#1D4ED8" />
                  <MetricBox label="Confirmed"      value={bookingData.data.confirmed ?? 0}     color="#F0FDF4" textColor="#15803D" />
                  <MetricBox label="Pending"        value={bookingData.data.pending ?? 0}       color="#FFFBEB" textColor="#B45309" />
                  <MetricBox label="Completed"      value={bookingData.data.completed ?? 0}     color="#F5F3FF" textColor="#7C3AED" />
                  <MetricBox label="Cancelled"      value={bookingData.data.cancelled ?? 0}     color="#FEF2F2" textColor="#DC2626" />
                </div>
                {bookingData.data.statusDistribution?.length > 0 && (
                  <>
                    <ChartCard title="Booking Status Distribution">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={bookingData.data.statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => name + ' ' + (percent*100).toFixed(0) + '%'} labelLine={false}>
                            {bookingData.data.statusDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={TT.contentStyle} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>
                        <tbody>
                          {bookingData.data.statusDistribution.map((item, i) => (
                            <tr key={i}>
                              <td><StatusBadge status={item.name} /></td>
                              <td>{item.value}</td>
                              <td>{bookingData.data.totalBookings > 0 ? ((item.value / bookingData.data.totalBookings) * 100).toFixed(1) : 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )
          )}

          {/* Top Models */}
          {activeTab === 'models' && (
            modelsLoading ? <LoadingBlock /> : !modelsData?.data ? <EmptyBlock /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  <MetricBox label="Models Tracked"   value={modelsData.data.totalModels ?? 0}     color="#EFF6FF" textColor="#1D4ED8" />
                  <MetricBox label="Best Seller"      value={modelsData.data.bestSeller || 'N/A'}  color="#F0FDF4" textColor="#15803D" />
                  <MetricBox label="Total Units Sold" value={modelsData.data.totalUnitsSold ?? 0}  color="#F5F3FF" textColor="#7C3AED" />
                </div>
                {modelsData.data.models?.length > 0 ? (
                  <>
                    <ChartCard title="Top Models by Units Sold">
                      <ResponsiveContainer width="100%" height={Math.max(240, modelsData.data.models.length * 36)}>
                        <BarChart data={modelsData.data.models} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                          <YAxis dataKey="model" type="category" width={90} tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={TT.contentStyle} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="unitsSold" fill="#002C5F" name="Units Sold" radius={[0,4,4,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead><tr><th>#</th><th>Model</th><th>Units Sold</th><th>Revenue</th><th>Avg Price</th><th>Market Share</th></tr></thead>
                        <tbody>
                          {modelsData.data.models.map((item, i) => (
                            <tr key={i}>
                              <td style={{ color: '#94A3B8', fontWeight: 600 }}>{i + 1}</td>
                              <td className="td-primary">{item.model}</td>
                              <td>{item.unitsSold}</td>
                              <td>{fmt(item.revenue)}</td>
                              <td>{fmt(item.avgPrice)}</td>
                              <td>{item.marketShare}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : <EmptyBlock message="No sales data for selected period" />}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default Reports;
