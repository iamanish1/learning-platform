import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Download, Calendar, Code, Database, Smartphone, Globe } from 'lucide-react';
import { formatDate } from '../../utils/blogUtils';

/**
 * DocumentationSection component for showcasing documentation
 * @param {Object} props
 * @param {Array} props.documentation - Array of documentation objects
 */
const DocumentationSection = memo(({ documentation = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (documentation.length === 0) {
    return null;
  }

  const categories = ['all', ...new Set(documentation.map((doc) => doc.category).filter(Boolean))];
  const filteredDocs = selectedCategory === 'all'
    ? documentation
    : documentation.filter((doc) => doc.category === selectedCategory);

  const getCategoryIcon = (category) => {
    const categoryLower = (category || '').toLowerCase();
    if (categoryLower.includes('frontend') || categoryLower.includes('web')) {
      return Globe;
    }
    if (categoryLower.includes('mobile')) {
      return Smartphone;
    }
    if (categoryLower.includes('backend') || categoryLower.includes('api')) {
      return Database;
    }
    return Code;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentation</h2>
          <p className="text-gray-600">Access comprehensive guides and API documentation</p>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const CategoryIcon = category !== 'all' ? getCategoryIcon(category) : BookOpen;
            return (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc, index) => {
          const CategoryIcon = getCategoryIcon(doc.category);

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{doc.title}</h3>
                      {doc.version && (
                        <span className="text-xs text-gray-500">v{doc.version}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {doc.description || doc.excerpt}
                </p>

                {/* Meta Information */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {doc.lastUpdated && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {formatDate(doc.lastUpdated, 'relative')}</span>
                    </div>
                  )}
                  {doc.category && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md">
                        {doc.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {doc.url && (
                    <motion.a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Docs</span>
                    </motion.a>
                  )}
                  {doc.pdfUrl && (
                    <motion.a
                      href={doc.pdfUrl}
                      download
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

DocumentationSection.displayName = 'DocumentationSection';

export default DocumentationSection;

