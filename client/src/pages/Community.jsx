import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCommunities, setLoading, setFilters } from '../store/slices/communitySlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS, COMMUNITY_TYPES } from '../shared/constants';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner';

const Community = () => {
  const dispatch = useDispatch();
  const { communities, loading, filters } = useSelector((state) => state.community);
  const { get } = useApi();

  useEffect(() => {
    loadCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadCommunities = async () => {
    dispatch(setLoading(true));
    const result = await get(API_ENDPOINTS.COMMUNITY.LIST);
    if (result.success) {
      dispatch(setCommunities(result.data));
    }
    dispatch(setLoading(false));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const filteredCommunities = communities.filter((community) => {
    if (filters.type !== 'all' && community.type !== filters.type) return false;
    return true;
  });

  const getCommunityIcon = (type) => {
    switch (type) {
      case COMMUNITY_TYPES.AI_ML:
        return '🤖';
      case COMMUNITY_TYPES.WEB_DEV:
        return '💻';
      case COMMUNITY_TYPES.CYBERSECURITY:
        return '🔒';
      case COMMUNITY_TYPES.COLLEGE_CLUBS:
        return '🎓';
      default:
        return '👥';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Communities</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Communities</option>
          <option value={COMMUNITY_TYPES.AI_ML}>AI/ML</option>
          <option value={COMMUNITY_TYPES.WEB_DEV}>Web Development</option>
          <option value={COMMUNITY_TYPES.CYBERSECURITY}>Cybersecurity</option>
          <option value={COMMUNITY_TYPES.COLLEGE_CLUBS}>College Clubs</option>
        </select>
      </div>

      {/* Communities List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredCommunities.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No communities found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCommunities.map((community) => (
            <Card key={community.id} hover>
              <div className="space-y-4 text-center">
                <div className="text-5xl mb-4">{getCommunityIcon(community.type)}</div>
                <h3 className="text-xl font-semibold">{community.name}</h3>
                <p className="text-gray-600 line-clamp-2">{community.description}</p>
                <div className="text-sm text-gray-500">
                  <p>{community.memberCount || 0} members</p>
                </div>
                <Link to={`/community/${community.id}`}>
                  <Button className="w-full">Join Community</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;

