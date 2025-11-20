/**
 * Utility functions for live sessions
 */

/**
 * Calculate session status based on start and end dates
 * @param {string|Date} startDate - Session start date
 * @param {string|Date} endDate - Session end date
 * @returns {string} - 'live', 'upcoming', or 'past'
 */
export const getSessionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (end && now > end) {
    return 'past';
  }
  if (now >= start && (!end || now <= end)) {
    return 'live';
  }
  return 'upcoming';
};

/**
 * Format session date with relative time
 * @param {string|Date} date - Date to format
 * @param {boolean} showRelative - Whether to show relative time (e.g., "In 2 hours")
 * @returns {string} - Formatted date string
 */
export const formatSessionDate = (date, showRelative = true) => {
  const sessionDate = new Date(date);
  const now = new Date();
  const diffMs = sessionDate - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (showRelative) {
    // Past sessions
    if (diffMs < 0) {
      const absMins = Math.abs(diffMins);
      const absHours = Math.abs(diffHours);
      const absDays = Math.abs(diffDays);

      if (absMins < 60) {
        return `${absMins} minute${absMins !== 1 ? 's' : ''} ago`;
      }
      if (absHours < 24) {
        return `${absHours} hour${absHours !== 1 ? 's' : ''} ago`;
      }
      if (absDays < 7) {
        return `${absDays} day${absDays !== 1 ? 's' : ''} ago`;
      }
    }

    // Upcoming sessions
    if (diffMins < 60) {
      return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    }
    if (diffHours < 24) {
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    }
    if (diffDays < 7) {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  }

  // Absolute date formatting
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return sessionDate.toLocaleDateString('en-US', options);
};

/**
 * Get countdown timer data for upcoming sessions
 * @param {string|Date} date - Target date
 * @returns {Object} - { days, hours, minutes, seconds, isExpired }
 */
export const getCountdown = (date) => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffMs = targetDate - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Format countdown as string
 * @param {Object} countdown - Countdown object from getCountdown
 * @returns {string} - Formatted countdown string
 */
export const formatCountdown = (countdown) => {
  if (countdown.isExpired) {
    return 'Started';
  }

  const { days, hours, minutes } = countdown;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Filter sessions based on filters and search query
 * @param {Array} sessions - Array of session objects
 * @param {Object} filters - Filter object { type, status, category, search }
 * @returns {Array} - Filtered sessions
 */
export const filterSessions = (sessions, filters) => {
  let filtered = [...sessions];

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((session) => session.type === filters.type);
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((session) => {
      const status = session.status || getSessionStatus(session.startDate || session.date, session.endDate);
      return status === filters.status;
    });
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((session) => {
      const categories = session.categories || session.category || [];
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      return categoryArray.some((cat) => 
        cat.toLowerCase() === filters.category.toLowerCase() ||
        (typeof cat === 'object' && cat.name?.toLowerCase() === filters.category.toLowerCase())
      );
    });
  }

  // Filter by search query
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter((session) => {
      const title = (session.title || '').toLowerCase();
      const description = (session.description || '').toLowerCase();
      const instructor = (session.instructor || '').toLowerCase();
      const categories = (session.categories || session.category || [])
        .map((cat) => (typeof cat === 'object' ? cat.name : cat).toLowerCase())
        .join(' ');

      return (
        title.includes(searchLower) ||
        description.includes(searchLower) ||
        instructor.includes(searchLower) ||
        categories.includes(searchLower)
      );
    });
  }

  return filtered;
};

/**
 * Sort sessions by various criteria
 * @param {Array} sessions - Array of session objects
 * @param {string} sortBy - Sort criteria ('date', 'popularity', 'title', 'instructor')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted sessions
 */
export const sortSessions = (sessions, sortBy = 'date', order = 'asc') => {
  const sorted = [...sessions];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.startDate || a.date || 0);
        const dateB = new Date(b.startDate || b.date || 0);
        comparison = dateA - dateB;
        break;

      case 'popularity':
        const popularityA = a.participants?.length || a.participantCount || 0;
        const popularityB = b.participants?.length || b.participantCount || 0;
        comparison = popularityB - popularityA; // Descending by default
        break;

      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;

      case 'instructor':
        comparison = (a.instructor || '').localeCompare(b.instructor || '');
        break;

      default:
        return 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Get all unique categories from sessions
 * @param {Array} sessions - Array of session objects
 * @returns {Array} - Array of unique category names
 */
export const getUniqueCategories = (sessions) => {
  const categoriesSet = new Set();

  sessions.forEach((session) => {
    const categories = session.categories || session.category || [];
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    categoryArray.forEach((cat) => {
      if (cat) {
        const categoryName = typeof cat === 'object' ? cat.name : cat;
        if (categoryName) {
          categoriesSet.add(categoryName);
        }
      }
    });
  });

  return Array.from(categoriesSet).sort();
};

/**
 * Calculate session statistics
 * @param {Array} sessions - Array of session objects
 * @returns {Object} - Statistics object
 */
export const getSessionStats = (sessions) => {
  const stats = {
    total: sessions.length,
    live: 0,
    upcoming: 0,
    past: 0,
    free: 0,
    paid: 0,
  };

  sessions.forEach((session) => {
    const status = session.status || getSessionStatus(session.startDate || session.date, session.endDate);
    
    if (status === 'live') stats.live++;
    else if (status === 'upcoming') stats.upcoming++;
    else if (status === 'past') stats.past++;

    if (session.type === 'free') stats.free++;
    else if (session.type === 'paid') stats.paid++;
  });

  return stats;
};

/**
 * Format duration in minutes to readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration (e.g., "1h 30m", "45m")
 */
export const formatDuration = (minutes) => {
  if (!minutes) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

