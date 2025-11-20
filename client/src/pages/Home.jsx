import { lazy, Suspense } from 'react';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import Footer from '../shared/components/Footer';

// Lazy load landing components for code splitting
const Hero = lazy(() => import('../components/landing/Hero'));
const StatsBar = lazy(() => import('../components/landing/StatsBar'));
const Features = lazy(() => import('../components/landing/Features'));
const Testimonials = lazy(() => import('../components/landing/Testimonials'));
const HowItWorks = lazy(() => import('../components/landing/HowItWorks'));
const CommunityActivity = lazy(() => import('../components/landing/CommunityActivity'));
const FreeResources = lazy(() => import('../components/landing/FreeResources'));
const FAQ = lazy(() => import('../components/landing/FAQ'));
const FinalCTA = lazy(() => import('../components/landing/FinalCTA'));

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section - Load immediately for above-the-fold content */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <Hero />
      </Suspense>

      {/* Stats Bar */}
      <Suspense fallback={<div className="py-16"><LoadingSpinner /></div>}>
        <StatsBar />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <Features />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <Testimonials />
      </Suspense>

      {/* How It Works */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <HowItWorks />
      </Suspense>

      {/* Community Activity */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <CommunityActivity />
      </Suspense>

      {/* Free Resources */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <FreeResources />
      </Suspense>

      {/* FAQ Section */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <FAQ />
      </Suspense>

      {/* Final CTA */}
      <Suspense fallback={<div className="py-20"><LoadingSpinner /></div>}>
        <FinalCTA />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
