import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testDriveService } from '../services/testDriveService';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Plus, CheckCircle, XCircle, List, Calendar as CalendarIcon } from 'lucide-react';
import Modal from '../components/Modal';
import BookTestDriveForm from '../components/testdrives/BookTestDriveForm';
import TestDriveDetailsModal from '../components/testdrives/TestDriveDetailsModal';
import FeedbackModal from '../components/testdrives/FeedbackModal';
import Pagination from '../components/Pagination';
import PageHeader from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/Badge';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const STATUS_COLORS = {
  COMPLETED: '#15803D',
  CANCELLED: '#DC2626',
  SCHEDULED: '#1D4ED8',
};

const TestDrives = () => {
  const queryClient = useQueryClient();
  const [view, setView] = useState('calendar');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTestDrive, setSelectedTestDrive] = useState(null);

  // Pagination state for list view
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const { data: testDrives, isLoading, refetch } = useQuery({
    queryKey: ['test-drives'],
    queryFn: () => testDriveService.getAllTestDrives(),
  });

  // Client-side pagination for list view
  const paginatedData = useMemo(() => {
    const allTestDrives = testDrives?.data || [];
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      content: allTestDrives.slice(startIndex, endIndex),
      totalElements: allTestDrives.length,
      totalPages: Math.ceil(allTestDrives.length / pageSize),
    };
  }, [testDrives, page, pageSize]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, feedback }) => testDriveService.updateStatus(id, status, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries(['test-drives']);
      alert('Status updated successfully');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => testDriveService.cancelTestDrive(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['test-drives']);
      alert('Test drive cancelled');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to cancel test drive');
    }
  });

  const events = useMemo(() => {
    if (!testDrives?.data) return [];
    return testDrives.data.map((td) => ({
      id: td.id,
      title: `${td.customerName} — ${td.vehicleModel}`,
      start: new Date(td.scheduledDateTime),
      end: new Date(new Date(td.scheduledDateTime).getTime() + 60 * 60 * 1000),
      resource: td,
      status: td.status,
    }));
  }, [testDrives]);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: STATUS_COLORS[event.status] || '#1D4ED8',
      borderRadius: 4,
      color: '#fff',
      border: 'none',
      fontSize: 12,
    },
  });

  const handleSelectEvent = (event) => {
    setSelectedTestDrive(event.resource);
    setShowDetailsModal(true);
  };

  const handleMarkCompleted = (td) => {
    setSelectedTestDrive(td);
    setShowFeedbackModal(true);
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this test drive?')) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Test Drives"
        subtitle={`${testDrives?.data?.length ?? 0} test drives`}
      >
        <div className="view-toggle">
          <button
            className={`view-toggle-btn${view === 'calendar' ? ' active' : ''}`}
            onClick={() => setView('calendar')}
          >
            <CalendarIcon style={{ width: 13, height: 13 }} />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            className={`view-toggle-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
          >
            <List style={{ width: 13, height: 13 }} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
        <button onClick={() => setShowBookModal(true)} className="btn btn-primary btn-sm">
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Book Test Drive</span>
        </button>
      </PageHeader>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="card" style={{ padding: '1rem', height: 680 }}>
          {isLoading ? (
            <div className="flex-center" style={{ height: '100%' }}>
              <div className="spinner" />
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
            />
          )}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="card" style={{ padding: '1rem' }}>
          {isLoading ? (
            <div className="flex-center" style={{ padding: '3rem 0' }}>
              <div className="spinner" />
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date &amp; Time</th>
                      <th className="hidden md:table-cell">Customer</th>
                      <th>Vehicle</th>
                      <th className="hidden lg:table-cell">License No.</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.content.map((td) => (
                      <tr key={td.testDriveId}>
                        <td className="td-primary">
                          {new Date(td.scheduledDateTime).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="hidden md:table-cell">{td.customerName}</td>
                        <td>{td.vehicleModel}</td>
                        <td className="hidden lg:table-cell" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {td.driverLicenseNumber}
                        </td>
                        <td><StatusBadge status={td.status} /></td>
                        <td>
                          <div className="flex-gap-2">
                            {td.status === 'SCHEDULED' && (
                              <>
                                <button
                                  onClick={() => handleMarkCompleted(td)}
                                  className="btn btn-ghost btn-icon"
                                  title="Mark Completed"
                                >
                                  <CheckCircle style={{ width: 15, height: 15, color: '#15803D' }} />
                                </button>
                                <button
                                  onClick={() => handleCancel(td.testDriveId)}
                                  className="btn btn-ghost btn-icon"
                                  title="Cancel"
                                >
                                  <XCircle style={{ width: 15, height: 15, color: '#DC2626' }} />
                                </button>
                              </>
                            )}
                            {td.status === 'COMPLETED' && td.feedback && (
                              <button
                                onClick={() => { setSelectedTestDrive(td); setShowDetailsModal(true); }}
                                className="btn btn-ghost btn-sm"
                                style={{ color: '#1D4ED8' }}
                              >
                                View Feedback
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginatedData.content.length === 0 && (
                  <div className="table-empty">
                    <p className="text-sm font-medium">No test drives scheduled</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {paginatedData.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={paginatedData.totalPages}
                  totalElements={paginatedData.totalElements}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title="Book Test Drive" size="lg">
        <BookTestDriveForm
          onSuccess={() => { setShowBookModal(false); refetch(); }}
          onCancel={() => setShowBookModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedTestDrive(null); }}
        title="Test Drive Details"
        size="md"
      >
        <TestDriveDetailsModal testDrive={selectedTestDrive} />
      </Modal>

      <Modal
        isOpen={showFeedbackModal}
        onClose={() => { setShowFeedbackModal(false); setSelectedTestDrive(null); }}
        title="Complete Test Drive"
        size="md"
      >
        <FeedbackModal
          testDrive={selectedTestDrive}
          onSuccess={() => { setShowFeedbackModal(false); setSelectedTestDrive(null); refetch(); }}
          onCancel={() => { setShowFeedbackModal(false); setSelectedTestDrive(null); }}
        />
      </Modal>
    </div>
  );
};

export default TestDrives;
