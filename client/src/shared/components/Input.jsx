import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  success = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const isActive = isFocused || hasValue;
  const hasError = !!error;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                hasError
                  ? 'text-red-500'
                  : isActive
                  ? 'text-primary'
                  : 'text-gray-400'
              }`}
            />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-full px-4 rounded-lg border-2 transition-all duration-200
            ${Icon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${isActive ? 'pt-6 pb-2' : 'py-3.5'}
            ${hasError ? 'border-red-500 bg-red-50' : isActive ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'}
            ${isActive && !hasError ? 'shadow-md shadow-primary/10' : ''}
            focus:outline-none focus:ring-2 focus:ring-primary/20
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200
            placeholder:text-transparent
            ${className}
          `}
          placeholder={isActive ? (placeholder || '') : (placeholder || label || '')}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            htmlFor={name}
            className={`
              absolute pointer-events-none transition-all duration-200 origin-left
              ${Icon ? 'left-12' : 'left-4'}
              ${hasError ? 'text-red-500' : isActive ? 'text-primary' : 'text-gray-500'}
              ${isActive ? 'top-2 text-xs font-medium' : 'top-1/2 -translate-y-1/2 text-base font-normal'}
            `}
            animate={{
              scale: isActive ? 0.85 : 1,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none z-10"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Success Indicator */}
        {success && !hasError && isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
          >
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
