import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCommunities, setLoading, setFilters, setMyCommunities } from '../store/slices/communitySlice';
import { useApi } from '../shared/hooks/useApi';
import { API_ENDPOINTS } from '../shared/constants';
import CommunityCard from '../components/community/CommunityCard';
import CommunityFilters from '../components/community/CommunityFilters';
import FeaturedCommunities from '../components/community/FeaturedCommunities';
import { filterCommunities, sortCommunities } from '../utils/communityUtils';
import { Plus, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { mockCommunities } from '../data/mockCommunities';

const Community = () => {
  const dispatch = useDispatch();
  const { communities, loading, filters, myCommunities } = useSelector((state) => state.community);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { get } = useApi();

  useEffect(() => {
    loadCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCommunities = async () => {
    dispatch(setLoading(true));
    
    // TODO: Replace with actual API call once backend is connected
    // For now, use mock data
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use mock data
      dispatch(setCommunities(mockCommunities));
      
      // Set user's joined communities (mock - in real app, fetch from API)
      const joined = mockCommunities.filter((c, idx) => idx < 3); // Mock: first 3 are joined
      dispatch(setMyCommunities(joined));
      
      // Uncomment below when API is ready:
      // const result = await get(API_ENDPOINTS.COMMUNITY.LIST);
      // if (result.success) {
      //   dispatch(setCommunities(result.data));
      // }
      // const myResult = await get(API_ENDPOINTS.COMMUNITY.MY_COMMUNITIES);
      // if (myResult.success) {
      //   dispatch(setMyCommunities(myResult.data));
      // }
    } catch (error) {
      console.error('Error loading communities:', error);
      // Fallback to mock data on error
      dispatch(setCommunities(mockCommunities));
      dispatch(setMyCommunities(mockCommunities.filter((c, idx) => idx < 3)));
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

  // Filter and sort communities
  const filteredAndSortedCommunities = useMemo(() => {
    let filtered = filterCommunities(communities, filters);
    filtered = sortCommunities(filtered, filters.sortBy);
    return filtered;
  }, [communities, filters]);

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
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Discover Communities
              </h1>
            </div>
            <p className="text-gray-600 text-base sm:text-lg ml-16">
              Join communities, connect with peers, and grow together
            </p>
          </div>
          <Link to={isAuthenticated ? "/community/create" : "/login"}>
            <motion.button
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Create Community</span>
            </motion.button>
          </Link>
        </div>

        {/* Quick Stats Bar */}
        {!loading && communities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{communities.length}</div>
                  <div className="text-xs text-gray-600">Total Communities</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{myCommunities.length}</div>
                  <div className="text-xs text-gray-600">Your Communities</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {communities.filter((c) => c.featured || c.isFeatured).length}
                  </div>
                  <div className="text-xs text-gray-600">Featured</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {communities.reduce((sum, c) => sum + (c.memberCount || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Members</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Featured Communities */}
      {!loading && communities.length > 0 && (
        <FeaturedCommunities communities={communities} myCommunities={myCommunities} />
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <CommunityFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          communities={communities}
        />
      </motion.div>

      {/* Communities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="pt-12 px-4 pb-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedCommunities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-12 text-center"
        >
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities found</h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.category !== 'all' || filters.type !== 'all'
              ? 'Try adjusting your filters to find more communities.'
              : 'Be the first to create a community!'}
          </p>
          {isAuthenticated && (
            <Link to="/community/create">
              <motion.button
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Community</span>
              </motion.button>
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAndSortedCommunities.map((community, index) => (
            <CommunityCard
              key={community.id}
              community={community}
              index={index}
              myCommunities={myCommunities}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Community;
