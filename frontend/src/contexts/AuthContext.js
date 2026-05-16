import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user info
      axios.get('/api/auth/profile/')
        .then(response => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data,
              token: token,
            },
          });
        })
        .catch(() => {
          dispatch({ type: 'AUTH_ERROR', payload: 'Token expired' });
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/api/auth/login/', { email, password });
      
      const { user, access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: user,
          token: access,
        },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data?.detail || 'Login failed',
      });
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/api/auth/register/', userData);
      
      const { user, access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: user,
          token: access,
        },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.response?.data || 'Registration failed',
      });
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post('/api/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'LOGOUT' });
    }
  };

  const hasVipAccess = (tier) => {
    if (!state.user) return false;
    
    const tierExpiryMap = {
      vip: state.user.vip_sure_draw_expiry,
      ht: state.user.vip_ht_draw_expiry,
      htft: state.user.vip_htft_draw_expiry,
      daily_fixed: state.user.vip_daily_fixed_expiry,
    };
    
    const expiry = tierExpiryMap[tier];
    if (!expiry) return false;
    
    return new Date(expiry) > new Date();
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    hasVipAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
