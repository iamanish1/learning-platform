import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setEvents, setLoading, setFilters } from '../store/slices/eventsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import EventFilters from '../components/events/EventFilters';
import EventCard from '../components/events/EventCard';
import FeaturedEvents from '../components/events/FeaturedEvents';
import EmptyState from '../components/events/EmptyState';
import EventSkeleton from '../components/events/EventSkeleton';
import { filterEvents, getEventStats, getEventStatus } from '../utils/eventUtils';
import { Video, Users, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { mockEvents } from '../data/mockEvents';

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, filters } = useSelector((state) => state.events);
  const { get } = useApi();

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update event statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Status updates are handled in EventCard component
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadEvents = async () => {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call once backend is connected
    // For now, use mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use mock data
      const eventsWithStatus = mockEvents.map((event) => ({
        ...event,
        status: event.status || getEventStatus(event.startDate || event.date, event.endDate),
      }));
      dispatch(setEvents(eventsWithStatus));
      
      // Uncomment below when API is ready:
      // const result = await get(API_ENDPOINTS.EVENTS.LIST);
      // if (result.success) {
      //   const eventsWithStatus = result.data.map((event) => ({
      //     ...event,
      //     status: event.status || getEventStatus(event.startDate || event.date, event.endDate),
      //   }));
      //   dispatch(setEvents(eventsWithStatus));
      // }
    } catch (error) {
      console.error('Error loading events:', error);
      // Fallback to mock data on error
      const eventsWithStatus = mockEvents.map((event) => ({
        ...event,
        status: event.status || getEventStatus(event.startDate || event.date, event.endDate),
      }));
      dispatch(setEvents(eventsWithStatus));
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
    dispatch(setFilters({ status: 'all', type: 'all', category: 'all', search: '', pricing: 'all' }));
  }, [dispatch]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const filtered = filterEvents(events, filters);
    // Sort: live first, then upcoming, then past
    return filtered.sort((a, b) => {
      const statusA = a.status || getEventStatus(a.startDate || a.date, a.endDate);
      const statusB = b.status || getEventStatus(b.startDate || b.date, b.endDate);

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
  }, [events, filters]);

  // Calculate statistics
  const stats = useMemo(() => getEventStats(events), [events]);

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
            Events & Hackathons
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Join exciting hackathons, challenges, workshops, and competitions. Build projects, learn skills, and compete for prizes.
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
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-600">Total Events</div>
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
                <div className="text-2xl font-bold text-gray-900">{stats.participants}</div>
                <div className="text-xs text-gray-600">Total Participants</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Events */}
      {!loading && events.length > 0 && (
        <FeaturedEvents events={events} />
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <EventFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          events={events}
        />
      </motion.div>

      {/* Events Grid */}
      {loading ? (
        <EventSkeleton count={6} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState filters={filters} onClearFilters={handleClearFilters} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Events;
