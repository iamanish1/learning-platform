import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCommunity, setDiscussions, setAnnouncements, setMembers, setLoading } from '../store/slices/communitySlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import GroupChat from '../features/community/components/GroupChat';

const CommunityDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeCommunity, discussions, announcements, members, loading } = useSelector((state) => state.community);
  const [activeTab, setActiveTab] = useState('discussions');
  const { get } = useApi();

  useEffect(() => {
    loadCommunity();
    loadDiscussions();
    loadAnnouncements();
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCommunity = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.COMMUNITY.DETAIL(id));
    if (result.success) {
      dispatch(setActiveCommunity(result.data));
    }
    dispatch(setLoading(false));
  };

  const loadDiscussions = async () => {
    const result = await get(API_ENDPOINTS.COMMUNITY.DISCUSSIONS(id));
    if (result.success) {
      dispatch(setDiscussions(result.data));
    }
  };

  const loadAnnouncements = async () => {
    const result = await get(API_ENDPOINTS.COMMUNITY.ANNOUNCEMENTS(id));
    if (result.success) {
      dispatch(setAnnouncements(result.data));
    }
  };

  const loadMembers = async () => {
    const result = await get(API_ENDPOINTS.COMMUNITY.MEMBERS(id));
    if (result.success) {
      dispatch(setMembers(result.data));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!activeCommunity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Community not found</p>
        <Link to="/community">
          <Button>Back to Communities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/community">
        <Button variant="ghost">← Back</Button>
      </Link>

      {/* Community Header */}
      <Card>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{activeCommunity.name}</h1>
          <p className="text-gray-600 text-lg">{activeCommunity.description}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <span>{members.length} members</span>
            <span>•</span>
            <span>{discussions.length} discussions</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'discussions'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Discussions
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'announcements'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Announcements
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'chat'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Group Chat
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'members'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Members
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Card key={discussion.id} hover>
              <Link to={`/community/${id}/discussion/${discussion.id}`}>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{discussion.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{discussion.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {discussion.author}</span>
                    <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    Announcement
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{announcement.title}</h3>
                <p className="text-gray-600">{announcement.content}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'chat' && <GroupChat communityId={id} />}

      {activeTab === 'members' && (
        <Card>
          <h3 className="font-semibold mb-4">Members ({members.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  {member.name?.[0] || 'M'}
                </div>
                <span className="text-sm">{member.name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CommunityDetail;

