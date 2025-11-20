/**
 * Utility functions for events
 */

/**
 * Calculate event status based on start and end dates
 * @param {string|Date} startDate - Event start date
 * @param {string|Date} endDate - Event end date
 * @returns {string} - 'live', 'upcoming', or 'past'
 */
export const getEventStatus = (startDate, endDate) => {
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
 * Format event date with relative time
 * @param {string|Date} date - Date to format
 * @param {boolean} showRelative - Whether to show relative time (e.g., "In 2 hours")
 * @returns {string} - Formatted date string
 */
export const formatEventDate = (date, showRelative = true) => {
  const eventDate = new Date(date);
  const now = new Date();
  const diffMs = eventDate - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (showRelative) {
    // Past events
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

    // Upcoming events
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

  return eventDate.toLocaleDateString('en-US', options);
};

/**
 * Get countdown timer data for upcoming events
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
 * Filter events based on filters and search query
 * @param {Array} events - Array of event objects
 * @param {Object} filters - Filter object { type, status, category, search }
 * @returns {Array} - Filtered events
 */
export const filterEvents = (events, filters) => {
  let filtered = [...events];

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((event) => event.type === filters.type);
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((event) => {
      const status = event.status || getEventStatus(event.startDate || event.date, event.endDate);
      return status === filters.status;
    });
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((event) => {
      const categories = event.categories || event.category || [];
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      return categoryArray.some((cat) => 
        cat.toLowerCase() === filters.category.toLowerCase() ||
        (typeof cat === 'object' && cat.name?.toLowerCase() === filters.category.toLowerCase())
      );
    });
  }

  // Filter by pricing (free/paid)
  if (filters.pricing && filters.pricing !== 'all') {
    filtered = filtered.filter((event) => {
      const isFree = event.price === 0 || event.price === null || event.type === 'free' || !event.price;
      return filters.pricing === 'free' ? isFree : !isFree;
    });
  }

  // Filter by search query
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter((event) => {
      const title = (event.title || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const organizer = (event.organizer || event.instructor || '').toLowerCase();
      const categories = (event.categories || event.category || [])
        .map((cat) => (typeof cat === 'object' ? cat.name : cat).toLowerCase())
        .join(' ');

      return (
        title.includes(searchLower) ||
        description.includes(searchLower) ||
        organizer.includes(searchLower) ||
        categories.includes(searchLower)
      );
    });
  }

  return filtered;
};

/**
 * Sort events by various criteria
 * @param {Array} events - Array of event objects
 * @param {string} sortBy - Sort criteria ('date', 'popularity', 'title', 'organizer')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted events
 */
export const sortEvents = (events, sortBy = 'date', order = 'asc') => {
  const sorted = [...events];

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

      case 'organizer':
        const organizerA = a.organizer || a.instructor || '';
        const organizerB = b.organizer || b.instructor || '';
        comparison = organizerA.localeCompare(organizerB);
        break;

      default:
        return 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

/**
 * Get all unique categories from events
 * @param {Array} events - Array of event objects
 * @returns {Array} - Array of unique category names
 */
export const getUniqueCategories = (events) => {
  const categoriesSet = new Set();

  events.forEach((event) => {
    const categories = event.categories || event.category || [];
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
 * Calculate event statistics
 * @param {Array} events - Array of event objects
 * @returns {Object} - Statistics object
 */
export const getEventStats = (events) => {
  const stats = {
    total: events.length,
    live: 0,
    upcoming: 0,
    past: 0,
    free: 0,
    paid: 0,
    totalParticipants: 0,
  };

  events.forEach((event) => {
    const status = event.status || getEventStatus(event.startDate || event.date, event.endDate);
    
    if (status === 'live') stats.live++;
    else if (status === 'upcoming') stats.upcoming++;
    else if (status === 'past') stats.past++;

    const isFree = event.price === 0 || event.price === null || event.type === 'free' || !event.price;
    if (isFree) stats.free++;
    else stats.paid++;

    stats.totalParticipants += event.participants?.length || event.participantCount || 0;
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

/**
 * Format prize/reward information
 * @param {Object|string|number} prize - Prize information
 * @returns {string} - Formatted prize string
 */
export const formatPrize = (prize) => {
  if (!prize) return null;

  if (typeof prize === 'string') {
    return prize;
  }

  if (typeof prize === 'number') {
    return `$${prize.toLocaleString()}`;
  }

  if (typeof prize === 'object') {
    if (prize.amount) {
      return `$${prize.amount.toLocaleString()}${prize.currency ? ` ${prize.currency}` : ''}`;
    }
    if (prize.total) {
      return `$${prize.total.toLocaleString()}${prize.currency ? ` ${prize.currency}` : ''}`;
    }
    return prize.description || prize.name || 'Prize Available';
  }

  return 'Prize Available';
};

/**
 * Get event type color scheme
 * @param {string} type - Event type (hackathon, challenge, workshop, competition)
 * @returns {Object} - Color scheme object
 */
export const getEventTypeColors = (type) => {
  const colorSchemes = {
    hackathon: {
      bg: 'from-orange-500/20 via-red-500/20 to-orange-200/20',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      accent: 'text-orange-600',
    },
    challenge: {
      bg: 'from-blue-500/20 via-indigo-500/20 to-blue-200/20',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      accent: 'text-blue-600',
    },
    workshop: {
      bg: 'from-green-500/20 via-emerald-500/20 to-green-200/20',
      badge: 'bg-green-100 text-green-800 border-green-200',
      accent: 'text-green-600',
    },
    competition: {
      bg: 'from-purple-500/20 via-pink-500/20 to-purple-200/20',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      accent: 'text-purple-600',
    },
  };

  return colorSchemes[type] || {
    bg: 'from-gray-500/20 via-gray-400/20 to-gray-200/20',
    badge: 'bg-gray-100 text-gray-800 border-gray-200',
    accent: 'text-gray-600',
  };
};

