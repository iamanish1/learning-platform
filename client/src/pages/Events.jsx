import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setEvents, setLoading, setFilters } from '../store/slices/eventsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';

const Events = () => {
  const dispatch = useDispatch();
  const { events, loading, filters } = useSelector((state) => state.events);
  const { get } = useApi();

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadEvents = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.EVENTS.LIST);
    if (result.success) {
      dispatch(setEvents(result.data));
    }
    dispatch(setLoading(false));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredEvents = events.filter((event) => {
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    if (filters.type !== 'all' && event.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events & Hackathons</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="past">Past</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="hackathon">Hackathon</option>
          <option value="challenge">Challenge</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No events found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} hover>
              <div className="space-y-4">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                  <span className="ml-2 inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600 line-clamp-2">{event.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Start: {new Date(event.startDate).toLocaleDateString()}</p>
                  <p>Participants: {event.participantCount || 0}</p>
                </div>
                <Link to={`/events/${event.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;

