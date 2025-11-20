import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../shared/hooks/useAuth';
import Input from '../shared/components/Input';
import RegisterVisual from '../components/auth/RegisterVisual';
import SocialLogin from '../components/auth/SocialLogin';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth
    console.log('GitHub login clicked');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 w-full">
      {/* Visual Section - Desktop Only */}
      <RegisterVisual />

      {/* Form Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Join DevHubs Academy and start your learning journey
              </p>
            </motion.div>

            {/* Social Login */}
            <motion.div variants={itemVariants}>
              <SocialLogin
                onGoogleLogin={handleGoogleLogin}
                onGithubLogin={handleGithubLogin}
                loading={loading}
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) {
                      setFieldErrors({ ...fieldErrors, name: '' });
                    }
                  }}
                  icon={User}
                  error={fieldErrors.name}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: '' });
                    }
                  }}
                  icon={Mail}
                  error={fieldErrors.email}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (fieldErrors.password) {
                      setFieldErrors({ ...fieldErrors, password: '' });
                    }
                    // Clear confirm password error if passwords now match
                    if (fieldErrors.confirmPassword && e.target.value === formData.confirmPassword) {
                      setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                    }
                  }}
                  icon={Lock}
                  error={fieldErrors.password}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                    }
                  }}
                  icon={Lock}
                  error={fieldErrors.confirmPassword}
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={loading ? {} : { scale: 1.01 }}
                  whileTap={loading ? {} : { scale: 0.99 }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-dark font-semibold transition-colors inline-flex items-center gap-1 group"
                >
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
