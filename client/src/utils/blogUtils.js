/**
 * Utility functions for blog posts and community content
 */

/**
 * Format date with relative time
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('relative' or 'absolute')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'relative') => {
  const postDate = new Date(date);
  const now = new Date();
  const diffMs = now - postDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (format === 'relative') {
    if (diffMins < 1) {
      return 'Just now';
    }
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    if (diffWeeks < 4) {
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    }
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    }
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  }

  // Absolute date formatting
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return postDate.toLocaleDateString('en-US', options);
};

/**
 * Calculate reading time based on word count
 * @param {string} content - Post content (HTML or markdown)
 * @returns {string} - Reading time (e.g., "5 min read")
 */
export const getReadingTime = (content) => {
  if (!content) return '1 min read';

  // Remove HTML tags and markdown syntax
  const text = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[#*`\[\]()]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Average reading speed: 200-250 words per minute
  // Using 225 as average
  const words = text.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  // Remove HTML tags for truncation
  const plainText = text.replace(/<[^>]*>/g, '').trim();

  if (plainText.length <= maxLength) return plainText;

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

/**
 * Filter posts based on filters
 * @param {Array} posts - Array of post objects
 * @param {Object} filters - Filter object { type, category, tag, search, author, sortBy }
 * @returns {Array} - Filtered posts
 */
export const filterPosts = (posts, filters) => {
  let filtered = [...posts];

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((post) => {
      const postType = getPostType(post);
      return postType === filters.type;
    });
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((post) => post.category === filters.category);
  }

  // Filter by tag
  if (filters.tag && filters.tag !== 'all') {
    filtered = filtered.filter((post) => {
      const tags = post.tags || [];
      return tags.some((tag) => 
        (typeof tag === 'string' ? tag : tag.name || tag).toLowerCase() === filters.tag.toLowerCase()
      );
    });
  }

  // Filter by author
  if (filters.author && filters.author !== 'all') {
    filtered = filtered.filter((post) => {
      const authorId = typeof post.author === 'object' ? post.author.id : post.author;
      const authorName = typeof post.author === 'object' ? post.author.name : post.author;
      return authorId === filters.author || authorName === filters.author;
    });
  }

  // Filter by search query
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter((post) => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || post.excerpt || '').toLowerCase();
      const excerpt = (post.excerpt || '').toLowerCase();
      const author = typeof post.author === 'object' 
        ? (post.author.name || '').toLowerCase()
        : (post.author || '').toLowerCase();
      const tags = (post.tags || [])
        .map((tag) => (typeof tag === 'object' ? tag.name : tag).toLowerCase())
        .join(' ');

      return (
        title.includes(searchLower) ||
        content.includes(searchLower) ||
        excerpt.includes(searchLower) ||
        author.includes(searchLower) ||
        tags.includes(searchLower)
      );
    });
  }

  return filtered;
};

/**
 * Sort posts by various criteria
 * @param {Array} posts - Array of post objects
 * @param {string} sortBy - Sort criteria ('latest', 'trending', 'popular', 'most_commented')
 * @returns {Array} - Sorted posts
 */
export const sortPosts = (posts, sortBy = 'latest') => {
  const sorted = [...posts];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        const dateA = new Date(a.createdAt || a.publishedAt || 0);
        const dateB = new Date(b.createdAt || b.publishedAt || 0);
        return dateB - dateA; // Newest first

      case 'trending':
        const scoreA = calculateEngagementScore(a);
        const scoreB = calculateEngagementScore(b);
        return scoreB - scoreA; // Highest score first

      case 'popular':
        const popularA = (a.likes || 0) + (a.views || 0) * 0.1;
        const popularB = (b.likes || 0) + (b.views || 0) * 0.1;
        return popularB - popularA; // Most popular first

      case 'most_commented':
        const commentsA = a.comments?.length || a.commentCount || 0;
        const commentsB = b.comments?.length || b.commentCount || 0;
        return commentsB - commentsA; // Most commented first

      default:
        return 0;
    }
  });

  return sorted;
};

/**
 * Get trending tags based on usage
 * @param {Array} posts - Array of post objects
 * @param {number} limit - Maximum number of tags to return
 * @returns {Array} - Array of trending tag objects { name, count }
 */
export const getTrendingTags = (posts, limit = 10) => {
  const tagCounts = {};

  posts.forEach((post) => {
    const tags = post.tags || [];
    tags.forEach((tag) => {
      const tagName = typeof tag === 'object' ? tag.name : tag;
      if (tagName) {
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      }
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Calculate post statistics
 * @param {Array} posts - Array of post objects
 * @returns {Object} - Statistics object
 */
export const getPostStats = (posts) => {
  const stats = {
    total: posts.length,
    articles: 0,
    projects: 0,
    documentation: 0,
    opinions: 0,
    totalAuthors: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
  };

  const authorsSet = new Set();

  posts.forEach((post) => {
    const type = getPostType(post);
    
    if (type === 'article') stats.articles++;
    else if (type === 'project') stats.projects++;
    else if (type === 'documentation') stats.documentation++;
    else if (type === 'opinion') stats.opinions++;

    const authorId = typeof post.author === 'object' ? post.author.id : post.author;
    if (authorId) {
      authorsSet.add(authorId);
    }

    stats.totalLikes += post.likes || 0;
    stats.totalComments += post.comments?.length || post.commentCount || 0;
    stats.totalViews += post.views || 0;
  });

  stats.totalAuthors = authorsSet.size;

  return stats;
};

/**
 * Extract excerpt from content
 * @param {string} content - Post content (HTML or markdown)
 * @param {number} length - Maximum length of excerpt
 * @returns {string} - Extracted excerpt
 */
export const extractExcerpt = (content, length = 150) => {
  if (!content) return '';

  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '').trim();

  if (plainText.length <= length) return plainText;

  // Extract first paragraph or truncate
  const firstParagraph = plainText.split('\n\n')[0] || plainText.split('\n')[0] || plainText;
  
  if (firstParagraph.length <= length) return firstParagraph;

  return truncateText(firstParagraph, length);
};

/**
 * Format author display name
 * @param {Object|string} author - Author object or name string
 * @returns {string} - Formatted author name
 */
export const formatAuthorName = (author) => {
  if (!author) return 'Anonymous';

  if (typeof author === 'string') {
    return author;
  }

  if (typeof author === 'object') {
    return author.name || author.username || author.email || 'Anonymous';
  }

  return 'Anonymous';
};

/**
 * Determine post type
 * @param {Object} post - Post object
 * @returns {string} - Post type (article, project, documentation, opinion)
 */
export const getPostType = (post) => {
  // Check explicit type field
  if (post.type) {
    return post.type;
  }

  // Infer from category or tags
  const category = (post.category || '').toLowerCase();
  const tags = (post.tags || []).map((tag) => 
    (typeof tag === 'object' ? tag.name : tag).toLowerCase()
  );

  if (category.includes('project') || tags.some((tag) => tag.includes('project'))) {
    return 'project';
  }

  if (category.includes('doc') || tags.some((tag) => tag.includes('documentation'))) {
    return 'documentation';
  }

  if (category.includes('opinion') || tags.some((tag) => tag.includes('opinion'))) {
    return 'opinion';
  }

  // Check for project indicators
  if (post.githubUrl || post.liveUrl || post.techStack) {
    return 'project';
  }

  // Default to article
  return 'article';
};

/**
 * Calculate engagement score for trending sorting
 * @param {Object} post - Post object
 * @returns {number} - Engagement score
 */
export const calculateEngagementScore = (post) => {
  const now = new Date();
  const postDate = new Date(post.createdAt || post.publishedAt || now);
  const daysSincePost = Math.max(1, Math.floor((now - postDate) / (1000 * 60 * 60 * 24)));

  // Weight factors
  const likesWeight = 2;
  const commentsWeight = 5;
  const viewsWeight = 0.1;
  const recencyWeight = 10; // Boost recent posts

  const likes = post.likes || 0;
  const comments = post.comments?.length || post.commentCount || 0;
  const views = post.views || 0;

  // Recency boost (more recent = higher score)
  const recencyBoost = recencyWeight / Math.log(daysSincePost + 1);

  // Calculate score
  const score = 
    likes * likesWeight +
    comments * commentsWeight +
    views * viewsWeight +
    recencyBoost;

  return score;
};

/**
 * Get unique categories from posts
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Array of unique category names
 */
export const getUniqueCategories = (posts) => {
  const categoriesSet = new Set();

  posts.forEach((post) => {
    if (post.category) {
      categoriesSet.add(post.category);
    }
  });

  return Array.from(categoriesSet).sort();
};

/**
 * Get unique authors from posts
 * @param {Array} posts - Array of post objects
 * @returns {Array} - Array of unique author objects
 */
export const getUniqueAuthors = (posts) => {
  const authorsMap = new Map();

  posts.forEach((post) => {
    if (post.author) {
      const authorId = typeof post.author === 'object' ? post.author.id : post.author;
      const authorName = typeof post.author === 'object' ? post.author.name : post.author;

      if (authorId && !authorsMap.has(authorId)) {
        authorsMap.set(authorId, {
          id: authorId,
          name: authorName,
          avatar: typeof post.author === 'object' ? post.author.avatar : null,
        });
      }
    }
  });

  return Array.from(authorsMap.values());
};

