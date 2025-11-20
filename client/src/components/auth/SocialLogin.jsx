import { memo } from 'react';
import { motion } from 'framer-motion';
import { Github, Chrome } from 'lucide-react';

const SocialLogin = memo(({ onGoogleLogin, onGithubLogin, loading = false }) => {
  const handleGoogleLogin = () => {
    if (onGoogleLogin && !loading) {
      onGoogleLogin();
    }
  };

  const handleGithubLogin = () => {
    if (onGithubLogin && !loading) {
      onGithubLogin();
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Social Login Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.99 }}
        >
          <Chrome className="w-4 h-4" />
          <span>Google</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={handleGithubLogin}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.99 }}
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative bg-white px-3">
          <span className="text-xs text-gray-500">or</span>
        </div>
      </div>
    </div>
  );
});

SocialLogin.displayName = 'SocialLogin';

export default SocialLogin;
