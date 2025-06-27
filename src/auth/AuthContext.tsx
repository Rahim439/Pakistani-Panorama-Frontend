import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

interface User {
  _id: string;
  userName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  checkAuthStatus: async () => false
});

export const useAuth = () => useContext(AuthContext);

// Use a constant for the API base URL
const API_BASE_URL = '/api/v1'; // Use the proxy configured in vite.config.ts

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingToken, setRefreshingToken] = useState(false);
  
  // Use useRef for token refresh promise to persist between renders
  const refreshTokenPromiseRef = useRef<Promise<boolean> | null>(null);

  const login = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Function to refresh the access token - with memoization to prevent multiple calls
  const refreshAccessToken = async (): Promise<boolean> => {
    // If already refreshing, return the existing promise
    if (refreshTokenPromiseRef.current) {
      return refreshTokenPromiseRef.current;
    }
    
    setRefreshingToken(true);
    
    // Create a new promise
    refreshTokenPromiseRef.current = new Promise<boolean>(async (resolve) => {
      try {
        console.log('Refreshing token...');
        const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Token refresh response:', data.success);
        resolve(data.success);
      } catch (error) {
        console.error('Token refresh error:', error);
        resolve(false);
      } finally {
        setRefreshingToken(false);
        // Clear the promise reference after completion
        setTimeout(() => {
          refreshTokenPromiseRef.current = null;
        }, 1000);
      }
    });
    
    return refreshTokenPromiseRef.current;
  };

  // Helper function to handle token refresh and user data fetching
  const handleTokenRefresh = async (): Promise<boolean> => {
    console.log('JWT expired, refreshing...');
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      try {
        // If refresh successful, try to get user data again
        return await fetchUserData();
      } catch (error) {
        console.error('Error after token refresh:', error);
      }
    }
    
    setUser(null);
    setIsAuthenticated(false);
    return false;
  };

  // Function to fetch user data from the API
  const fetchUserData = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log(`Server responded with ${response.status}`);
        if (response.status === 401) {
          return false;
        }
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Extract user data - handle different API response structures
        const userData = data.data?.user || data.data;
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      console.log('Checking auth status...');
      
      // Try to get user data with current token
      const isAuthenticated = await fetchUserData();
      
      // If not authenticated, try refreshing the token
      if (!isAuthenticated) {
        return await handleTokenRefresh();
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    
    // No localStorage listeners needed since we don't use localStorage
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}; 