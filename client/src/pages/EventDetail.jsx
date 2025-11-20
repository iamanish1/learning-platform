import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveEvent, setLoading, setTeams } from '../store/slices/eventsSlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import Modal from '../shared/components/Modal';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeEvent, teams, loading } = useSelector((state) => state.events);
  const { get, post } = useApi();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    loadEvent();
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEvent = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.EVENTS.DETAIL(id));
    if (result.success) {
      dispatch(setActiveEvent(result.data));
    }
    dispatch(setLoading(false));
  };

  const loadTeams = async () => {
    const result = await get(API_ENDPOINTS.EVENTS.TEAMS(id));
    if (result.success) {
      dispatch(setTeams(result.data));
    }
  };

  const handleRegister = async () => {
    const result = await post(API_ENDPOINTS.EVENTS.REGISTER(id));
    if (result.success) {
      loadEvent();
    }
  };

  const handleCreateTeam = async () => {
    const result = await post(API_ENDPOINTS.EVENTS.TEAMS(id), { name: teamName });
    if (result.success) {
      setShowTeamModal(false);
      setTeamName('');
      loadTeams();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Event not found</p>
        <Link to="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/events">
        <Button variant="ghost">← Back</Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm rounded ${
                    activeEvent.status === 'active' ? 'bg-green-100 text-green-800' :
                    activeEvent.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activeEvent.status}
                  </span>
                  <span className="px-3 py-1 text-sm rounded bg-primary/10 text-primary">
                    {activeEvent.type}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{activeEvent.title}</h1>
                <p className="text-gray-600 text-lg">{activeEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{new Date(activeEvent.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold">{new Date(activeEvent.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="font-semibold">{activeEvent.participantCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teams</p>
                  <p className="font-semibold">{teams.length}</p>
                </div>
              </div>

              {activeEvent.status !== 'past' && (
                <Button size="lg" className="w-full" onClick={handleRegister}>
                  Register for Event
                </Button>
              )}
            </div>
          </Card>

          {/* Projects Showcase */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <p className="text-gray-600">Projects will be displayed here after submission.</p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Teams */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Teams</h3>
              {activeEvent.status === 'active' && (
                <Button size="sm" onClick={() => setShowTeamModal(true)}>
                  Create Team
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {teams.map((team) => (
                <div key={team.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-gray-500">{team.members?.length || 0} members</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title="Create Team"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowTeamModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetail;

