import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './shared/components/Layout';
import ErrorBoundary from './shared/components/ErrorBoundary';
import LoadingSpinner from './shared/components/LoadingSpinner';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const LiveSessions = lazy(() => import('./pages/LiveSessions'));
const SessionDetail = lazy(() => import('./pages/SessionDetail'));
const VirtualClassroom = lazy(() => import('./pages/VirtualClassroom'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const BlogEditor = lazy(() => import('./pages/BlogEditor'));
const Community = lazy(() => import('./pages/Community'));
const CommunityDetail = lazy(() => import('./pages/CommunityDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Layout>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Live Sessions Routes */}
                <Route path="/live-sessions" element={<LiveSessions />} />
                <Route
                  path="/live-sessions/:id"
                  element={
                    <ProtectedRoute>
                      <SessionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/live-sessions/:id/classroom"
                  element={
                    <ProtectedRoute>
                      <VirtualClassroom />
                    </ProtectedRoute>
                  }
                />
                
                {/* Events Routes */}
                <Route path="/events" element={<Events />} />
                <Route
                  path="/events/:id"
                  element={
                    <ProtectedRoute>
                      <EventDetail />
                    </ProtectedRoute>
                  }
                />
                
                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route
                  path="/blog/new"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog/:id/edit"
                  element={
                    <ProtectedRoute>
                      <BlogEditor />
                    </ProtectedRoute>
                  }
                />
                
                {/* Community Routes */}
                <Route path="/community" element={<Community />} />
                <Route
                  path="/community/:id"
                  element={
                    <ProtectedRoute>
                      <CommunityDetail />
                    </ProtectedRoute>
                  }
                />
                
                {/* Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="text-center py-16">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a href="/" className="text-primary hover:underline">
                        Go back home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;

