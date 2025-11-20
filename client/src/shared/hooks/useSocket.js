import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socket';
import { getAuthToken } from '../services/auth';

export const useSocket = (events = {}) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      const token = getAuthToken();
      socketService.connect(token);
      socketRef.current = socketService.getSocket();

      // Set up event listeners
      Object.entries(events).forEach(([event, handler]) => {
        if (socketRef.current) {
          socketRef.current.on(event, handler);
        }
      });

      return () => {
        // Clean up event listeners
        Object.keys(events).forEach((event) => {
          if (socketRef.current) {
            socketRef.current.off(event);
          }
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, dispatch]);

  const emit = (event, data) => {
    socketService.emit(event, data);
  };

  const on = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketService.isConnected,
  };
};

export default useSocket;

