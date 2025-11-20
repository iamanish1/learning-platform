import { useState, useCallback } from 'react';
import api from '../services/api';
import { apiCache } from '../utils/cache';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config, useCache = false) => {
    // Check cache for GET requests
    if (useCache && config.method === 'GET' || !config.method) {
      const cached = apiCache.get(config.url);
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      
      // Cache GET responses
      if (useCache && (config.method === 'GET' || !config.method)) {
        apiCache.set(config.url, response.data);
      }
      
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage, data: err.response?.data };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}, useCache = true) => {
    return request({ ...config, method: 'GET', url }, useCache);
  }, [request]);

  const post = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'POST', url, data });
  }, [request]);

  const put = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PUT', url, data });
  }, [request]);

  const patch = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PATCH', url, data });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({ ...config, method: 'DELETE', url });
  }, [request]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
  };
};

export default useApi;

