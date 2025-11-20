import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setSessions, setLoading, setFilters } from '../store/slices/liveSessionsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import SessionFilters from '../components/live-sessions/SessionFilters';
import SessionCard from '../components/live-sessions/SessionCard';
import FeaturedSessions from '../components/live-sessions/FeaturedSessions';
import EmptyState from '../components/live-sessions/EmptyState';
import SessionSkeleton from '../components/live-sessions/SessionSkeleton';
import { filterSessions, getSessionStats, getSessionStatus } from '../utils/sessionUtils';
import { Video, Users, Calendar, TrendingUp } from 'lucide-react';
import { mockSessions } from '../data/mockSessions';

const LiveSessions = () => {
  const dispatch = useDispatch();
  const { sessions, loading, filters } = useSelector((state) => state.liveSessions);
  const { get } = useApi();

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update session statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Status updates are handled in SessionCard component
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call once backend is connected
    // For now, use mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use mock data
      const sessionsWithStatus = mockSessions.map((session) => ({
        ...session,
        status: session.status || getSessionStatus(session.startDate || session.date, session.endDate),
      }));
      dispatch(setSessions(sessionsWithStatus));
      
      // Uncomment below when API is ready:
      // const result = await get(API_ENDPOINTS.SESSIONS.LIST);
      // if (result.success) {
      //   const sessionsWithStatus = result.data.map((session) => ({
      //     ...session,
      //     status: session.status || getSessionStatus(session.startDate || session.date, session.endDate),
      //   }));
      //   dispatch(setSessions(sessionsWithStatus));
      // }
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Fallback to mock data on error
      const sessionsWithStatus = mockSessions.map((session) => ({
        ...session,
        status: session.status || getSessionStatus(session.startDate || session.date, session.endDate),
      }));
      dispatch(setSessions(sessionsWithStatus));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters({ ...filters, ...newFilters }));
    },
    [dispatch, filters]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(setFilters({ status: 'all', type: 'all', category: 'all', search: '' }));
  }, [dispatch]);

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    const filtered = filterSessions(sessions, filters);
    // Sort: live first, then upcoming, then past
    return filtered.sort((a, b) => {
      const statusA = a.status || getSessionStatus(a.startDate || a.date, a.endDate);
      const statusB = b.status || getSessionStatus(b.startDate || b.date, b.endDate);

      const statusOrder = { live: 0, upcoming: 1, past: 2 };
      const orderA = statusOrder[statusA] ?? 3;
      const orderB = statusOrder[statusB] ?? 3;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Within same status, sort by date
      const dateA = new Date(a.startDate || a.date || 0);
      const dateB = new Date(b.startDate || b.date || 0);
      return statusA === 'past' ? dateB - dateA : dateA - dateB;
    });
  }, [sessions, filters]);

  // Calculate statistics
  const stats = useMemo(() => getSessionStats(sessions), [sessions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Live Sessions & Webinars
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Join interactive learning sessions, webinars, and workshops from industry experts
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-600">Total Sessions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md border border-red-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.live}</div>
                <div className="text-xs text-gray-600">Live Now</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                <div className="text-xs text-gray-600">Upcoming</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.free}</div>
                <div className="text-xs text-gray-600">Free Sessions</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Live Sessions */}
      {!loading && sessions.length > 0 && (
        <FeaturedSessions sessions={sessions} />
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <SessionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          sessions={sessions}
        />
      </motion.div>

      {/* Sessions Grid */}
      {loading ? (
        <SessionSkeleton count={6} />
      ) : filteredSessions.length === 0 ? (
        <EmptyState filters={filters} onClearFilters={handleClearFilters} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSessions.map((session, index) => (
            <SessionCard key={session.id} session={session} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LiveSessions;
