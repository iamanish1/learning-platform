import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  Eye,
  Code,
  Award,
} from 'lucide-react';
import { formatDate, formatAuthorName } from '../../utils/blogUtils';

/**
 * ProjectCard component for showcasing projects
 * @param {Object} props
 * @param {Object} props.project - Project object
 * @param {number} props.index - Index for animation delay
 */
const ProjectCard = memo(({ project, index = 0 }) => {
  const authorName = formatAuthorName(project.author);
  const authorAvatar = typeof project.author === 'object' ? project.author.avatar : null;
  const techStack = project.techStack || project.tags || [];

  const handleExternalLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <Link to={`/blog/${project.id}`} className="block">
        {/* Project Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-200/20 overflow-hidden">
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Award className="w-3 h-3" />
                Featured
              </span>
            </div>
          )}

          {/* Project Image */}
          {project.thumbnail || project.screenshots?.[0] ? (
            <img
              src={project.thumbnail || project.screenshots[0]}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code className="w-16 h-16 text-purple-300" />
            </div>
          )}

          {/* Overlay with Links */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            {project.liveUrl && (
              <motion.button
                onClick={(e) => handleExternalLink(e, project.liveUrl)}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </motion.button>
            )}
            {project.githubUrl && (
              <motion.button
                onClick={(e) => handleExternalLink(e, project.githubUrl)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {project.description || project.excerpt || project.content}
          </p>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 5).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md"
                >
                  {typeof tech === 'object' ? tech.name : tech}
                </span>
              ))}
              {techStack.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                  +{techStack.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 text-xs font-semibold">
                    {authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="truncate">{authorName}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{formatDate(project.createdAt || project.publishedAt, 'relative')}</span>
            </div>

            {/* Project Stats */}
            {(project.stars || project.forks || project.views) && (
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                {project.stars > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{project.stars}</span>
                  </div>
                )}
                {project.forks > 0 && (
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    <span>{project.forks}</span>
                  </div>
                )}
                {project.views > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{project.views}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Project Button */}
          <motion.div
            className="pt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              <span>View Project</span>
            </button>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;

