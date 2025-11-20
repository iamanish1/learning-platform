import { memo } from 'react';

/**
 * EventSkeleton component for loading states
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to display
 */
const EventSkeleton = memo(({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>

          {/* Content Skeleton */}
          <div className="p-5 space-y-4">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Meta Info */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            </div>

            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

EventSkeleton.displayName = 'EventSkeleton';

export default EventSkeleton;

