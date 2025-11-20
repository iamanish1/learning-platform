import { memo } from 'react';

/**
 * CommunitySkeleton - Loading skeleton for community cards
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to display
 */
const CommunitySkeleton = memo(({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Banner */}
          <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300"></div>

          {/* Content */}
          <div className="pt-12 px-4 pb-4 space-y-3">
            {/* Name */}
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

CommunitySkeleton.displayName = 'CommunitySkeleton';

export default CommunitySkeleton;

