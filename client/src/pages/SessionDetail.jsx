import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSession, setLoading } from '../store/slices/liveSessionsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeSession, loading } = useSelector((state) => state.liveSessions);
  const { get } = useApi();

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadSession = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.SESSIONS.DETAIL(id));
    if (result.success) {
      dispatch(setActiveSession(result.data));
    }
    dispatch(setLoading(false));
  };

  const handleJoinSession = () => {
    navigate(`/live-sessions/${id}/classroom`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Session not found</p>
        <Link to="/live-sessions">
          <Button>Back to Sessions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/live-sessions">
        <Button variant="ghost">← Back</Button>
      </Link>

      <Card>
        <div className="space-y-6">
          <div>
            <div className="flex gap-2 mb-4">
              <span className={`px-3 py-1 text-sm rounded ${
                activeSession.type === 'free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {activeSession.type}
              </span>
              <span className={`px-3 py-1 text-sm rounded ${
                activeSession.status === 'live' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {activeSession.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{activeSession.title}</h1>
            <p className="text-gray-600 text-lg">{activeSession.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-semibold">{activeSession.instructor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold">{new Date(activeSession.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">{activeSession.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-semibold">{activeSession.participantCount || 0}</p>
            </div>
          </div>

          {activeSession.status === 'live' && (
            <Button size="lg" className="w-full" onClick={handleJoinSession}>
              Join Live Session
            </Button>
          )}

          {activeSession.status === 'upcoming' && (
            <div className="space-y-2">
              <Button size="lg" className="w-full" onClick={handleJoinSession}>
                Join When Live
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Session starts at {new Date(activeSession.date).toLocaleString()}
              </p>
            </div>
          )}

          {activeSession.recording && (
            <Link to={`/live-sessions/${id}/recording`}>
              <Button variant="outline" className="w-full">Watch Recording</Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SessionDetail;

