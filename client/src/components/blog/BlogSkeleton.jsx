import { memo } from 'react';

/**
 * BlogSkeleton component for loading states (feed layout)
 * @param {Object} props
 * @param {number} props.count - Number of skeleton cards to display
 */
const BlogSkeleton = memo(({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Author Header */}
          <div className="p-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            {/* Thumbnail (optional) */}
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Engagement Bar */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-12 bg-gray-200 rounded ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
});

BlogSkeleton.displayName = 'BlogSkeleton';

export default BlogSkeleton;
