import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {isHomePage ? (
        // Full-width layout for landing page
        <main className="w-full">
          {children}
        </main>
      ) : (
        // Constrained layout for other pages
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      )}
      {!isHomePage && (
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 DevHubs Academy. All rights reserved.</p>
              <p className="mt-2 text-sm">
                Empowering tier 2 & 3 college students to learn, build, and grow.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
