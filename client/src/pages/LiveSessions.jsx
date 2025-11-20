import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSessions, setLoading, setFilters } from '../store/slices/liveSessionsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';

const LiveSessions = () => {
  const dispatch = useDispatch();
  const { sessions, loading, filters } = useSelector((state) => state.liveSessions);
  const { get } = useApi();

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadSessions = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.SESSIONS.LIST);
    if (result.success) {
      dispatch(setSessions(result.data));
    }
    dispatch(setLoading(false));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredSessions = sessions.filter((session) => {
    if (filters.type !== 'all' && session.type !== filters.type) return false;
    if (filters.status !== 'all' && session.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Live Sessions & Webinars</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="past">Past</option>
        </select>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No sessions found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} hover>
              <div className="space-y-4">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    session.type === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {session.type}
                  </span>
                  <span className={`ml-2 inline-block px-2 py-1 text-xs rounded ${
                    session.status === 'live' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-gray-600 line-clamp-2">{session.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Instructor: {session.instructor}</p>
                  <p>Date: {new Date(session.date).toLocaleDateString()}</p>
                </div>
                <Link to={`/live-sessions/${session.id}`}>
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

export default LiveSessions;

