import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import KPICard from '../components/KPICard';
import {
  Car,
  BookOpen,
  TruckIcon,
  IndianRupee,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatusBadge } from '../components/ui/Badge';

const CHART_COLORS = ['#002C5F', '#00AAD2', '#0E4C92', '#64748B', '#94A3B8', '#CBD5E1'];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

const SectionCard = ({ title, subtitle, action, children }) => (
  <div className="card">
    <div className="card-header">
      <div>
        <p className="card-title">{title}</p>
        {subtitle && <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
    <div style={{ padding: 0 }}>
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const dealershipId = user?.role === 'SUPER_ADMIN' ? null : user?.dealershipId;

  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['dashboard-kpi', dealershipId],
    queryFn: () => dashboardService.getKPIData(dealershipId),
  });

  const { data: monthlySales, isLoading: salesLoading } = useQuery({
    queryKey: ['monthly-sales', dealershipId],
    queryFn: () => dashboardService.getMonthlySales(dealershipId),
  });

  const { data: inventoryStatus, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-status', dealershipId],
    queryFn: () => dashboardService.getInventoryByStatus(dealershipId),
  });

  const { data: todayTestDrives, isLoading: testDrivesLoading } = useQuery({
    queryKey: ['today-test-drives', dealershipId],
    queryFn: () => dashboardService.getTodayTestDrives(dealershipId),
  });

  const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['recent-bookings', dealershipId],
    queryFn: () => dashboardService.getRecentBookings(dealershipId, 5),
  });

  const { data: dueForDispatch } = useQuery({
    queryKey: ['due-for-dispatch', dealershipId],
    queryFn: () => dashboardService.getVehiclesDueForDispatch(dealershipId),
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">
            Good{new Date().getHours() < 12 ? ' morning' : new Date().getHours() < 18 ? ' afternoon' : ' evening'},{' '}
            {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="page-subtitle">
            {user?.role === 'SUPER_ADMIN'
              ? 'All dealerships overview'
              : user?.dealershipName || 'Your dealership'}{' '}
            &middot; {today}
          </p>
        </div>
      </div>

      {/* Dispatch Alert */}
      {dueForDispatch?.data?.length > 0 && (
        <div className="alert-banner warning">
          <AlertTriangle style={{ width: 18, height: 18, color: '#B45309', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E', marginBottom: '0.625rem' }}>
              {dueForDispatch.data.length} vehicle{dueForDispatch.data.length > 1 ? 's' : ''} due for dispatch
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {dueForDispatch.data.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    borderRadius: 6,
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #FDE68A',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0F172A' }}>
                      {v.model} — {v.variant}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '0.5rem' }}>
                      VIN: {v.vin}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                    Due: {new Date(v.expectedDeliveryDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <KPICard
          title="Vehicles in Stock"
          value={kpiData?.data?.totalVehicles ?? 0}
          icon={Car}
          color="blue"
          loading={kpiLoading}
        />
        <KPICard
          title="Bookings Today"
          value={kpiData?.data?.bookingsToday ?? 0}
          icon={BookOpen}
          color="green"
          trend={kpiData?.data?.bookingsTrend}
          trendValue={kpiData?.data?.bookingsTrendValue}
          loading={kpiLoading}
        />
        <KPICard
          title="Deliveries This Month"
          value={kpiData?.data?.deliveriesThisMonth ?? 0}
          icon={TruckIcon}
          color="purple"
          loading={kpiLoading}
        />
        <KPICard
          title="Revenue This Month"
          value={formatCurrency(kpiData?.data?.revenueThisMonth)}
          icon={IndianRupee}
          color="orange"
          trend={kpiData?.data?.revenueTrend}
          trendValue={kpiData?.data?.revenueTrendValue}
          loading={kpiLoading}
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Monthly Sales */}
        <SectionCard title="Monthly Sales Trend">
          {salesLoading ? (
            <div className="flex-center" style={{ height: 280 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ padding: '1rem' }}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlySales?.data || []} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'Sales Amount' ? formatCurrency(value) : value
                    }
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #E2E8F0',
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="sales" fill="#002C5F" name="Sales Amount" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="count" fill="#00AAD2" name="Units Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        {/* Inventory by Status */}
        <SectionCard title="Inventory by Status">
          {inventoryLoading ? (
            <div className="flex-center" style={{ height: 280 }}>
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ padding: '1rem' }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={inventoryStatus?.data || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {(inventoryStatus?.data || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #E2E8F0',
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Data Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Today's Test Drives */}
        <SectionCard
          title="Today's Test Drives"
          subtitle={`${todayTestDrives?.data?.length || 0} scheduled`}
        >
          {testDrivesLoading ? (
            <div className="flex-center" style={{ height: 180 }}>
              <div className="spinner" />
            </div>
          ) : todayTestDrives?.data?.length > 0 ? (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayTestDrives.data.map((drive) => (
                    <tr key={drive.id}>
                      <td className="td-primary">
                        {drive.scheduledDateTime
                          ? String(drive.scheduledDateTime).substring(0, 5)
                          : '—'}
                      </td>
                      <td>{drive.customerName}</td>
                      <td>{drive.vehicleModel}</td>
                      <td>
                        <StatusBadge status={drive.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-empty">
              <Calendar className="table-empty-icon mx-auto" />
              <p className="text-sm font-medium">No test drives today</p>
            </div>
          )}
        </SectionCard>

        {/* Recent Bookings */}
        <SectionCard
          title="Recent Bookings"
          action={
            <a href="/bookings" className="btn btn-ghost btn-sm" style={{ color: '#002C5F' }}>
              View all →
            </a>
          }
        >
          {bookingsLoading ? (
            <div className="flex-center" style={{ height: 180 }}>
              <div className="spinner" />
            </div>
          ) : recentBookings?.data?.length > 0 ? (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.data.map((booking) => (
                    <tr key={booking.id}>
                      <td className="td-primary">{booking.bookingNumber}</td>
                      <td>{booking.customerName}</td>
                      <td>{booking.vehicleModel}</td>
                      <td>
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-empty">
              <BookOpen className="table-empty-icon mx-auto" />
              <p className="text-sm font-medium">No recent bookings</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Dashboard;
