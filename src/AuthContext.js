import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const parseMauzaList = (mauzaList) => {
    if (typeof mauzaList === 'string') {
      return mauzaList.split(',').map((m) => m.trim());
    }
    return mauzaList || [];
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      const userData = response.data;
      userData.mauzaList = parseMauzaList(userData.mauzaList);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    try {
      // Clear any existing cookies to ensure no residual session data
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoading(true);

      await axios.post(`${BASE_URL}/login`, credentials, {
        withCredentials: true,
      });
      await fetchUserProfile();
      navigate('/');
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 401) {
        console.error('Unauthorized: Invalid credentials.');
        setError('Invalid credentials. Please try again.');
      } else if (error.response?.status === 403 && error.response.data?.userDetails) {
        throw {
          type: 'subscriptionExpired',
          details: error.response.data.userDetails || {
            userName: 'Unknown',
            startDate: null,
            endDate: null,
            daysRemaining: 0,
          },
        };
      } else {
        console.error('Login failed:', error.response?.data || error.message);
        setError('Login failed. Please check your credentials.');
      }
      throw new Error('Login failed.');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await axios.post(
        `${BASE_URL}/change-password`,
        { userId: user.userId, oldPassword, newPassword },
        { withCredentials: true }
      );

      // Clear the authToken cookie and immediately log out
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      await logout();
      setError(null);
    } catch (error) {
      console.error('Password change failed:', error);
      setError('Failed to change password. Please try again.');
      throw new Error('Failed to change password.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType: user?.userType,
        login,
        logout,
        changePassword,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
