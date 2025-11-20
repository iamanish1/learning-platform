import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout, updateUser } from '../../store/slices/authSlice';
import api from '../services/api';
import { API_ENDPOINTS } from '../constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));
      return { success: true, user, token };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));
      return { success: true, user, token };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const updateUserProfile = (userData) => {
    dispatch(updateUser(userData));
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    updateUser: updateUserProfile,
  };
};

export default useAuth;

